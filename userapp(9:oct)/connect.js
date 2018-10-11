var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var app = express();
//var router = express.Router();

var fs = require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var query = require('querystring');
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({ secret: "Your secret key", cookie: { maxAge: 3600000 }, saveUninitialized: true, resave: true }));


var async = require('async');

var users = require("./user.model")
var companys = require("./company.model")
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/userdb1"); //company database
//mongoose.connect("mongodb://localhost/companydb");


app.use(express.static(__dirname + "/angular"));
//app.use("/all", router);

app.post("/", function(req, res) {
    req.session.email = req.body.email;
    console.log("req.sess.email=" + req.session.email);

    console.log("inside login connect.js user app")
    console.log("email=" + req.body.email);
    console.log("pwd=" + req.body.password);

    if (!req.body.email || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    } else {
        users.find({ $and: [{ "email": req.body.email }, { "password": req.body.password }] }, function(err, docs) {
            console.log("leng=" + docs.length);
            if (docs.length > 0) {
                req.session.docs = docs;
                console.log(" post session=" + req.session.docs);
                res.redirect('#!user');
                //res.send(data);
            } else {
                var data = { "msg": "invalid credentials" };
                req.session.docs = docs;
                console.log(" post fail session=" + req.session.docs);
                console.log("invalid cond login=" + docs.length);
                // res.send("/");
                res.status("400");
                res.redirect('/');
                // res.send(data);
            }
        });
    }
})

// const authmiddleware = (req, res, next) => {
//     if (req.session && req.session.email) {
//         next();
//     } else {
//         res.status(403).send({ error: "log in first" });
//     }
// }

//logout
app.get('/logout', function(req, res) {
    req.session.destroy(function() {
        console.log("user logged out.")
    });
    res.redirect('/');
});

app.use('/user', function(err, req, res, next) {
    console.log(err);
    res.redirect('/');
});

//get 
app.get("/user", function(req, res) {

        console.log("res in get of connect.js" + res.length);
        console.log("inside connect.js user app")
        if (req.session.email != null) {
            users.find({}, function(err, docs) {
                console.log(docs);
                if (docs.length > 0) {
                    res.send(docs);
                }
            });
        }
        // else {
        //     res.send("nouser");
        // }
    })
    // app.get("/user", function(req, res) {
    //     console.log("res in get of connect.js" + res.length);
    //     console.log("inside connect.js user app")
    //     if (req.session.email != null) {
    //         users.find({}, function(err, docs) {
    //             console.log(docs);
    //             if (docs.length > 0) {
    //                 res.send(docs);
    //             } else {
    //                 res.send("nouser");
    //             }
    //         });
    //     } else {
    //         res.send("nosession");
    //     }
    // })
    //post
app.post("/user", function(req, res) {
    var user = req.body;
    console.log("user=" + user);
    console.log("user email =" + user.email);
    if (req.session.email == null) {
        return res.status(404).send();
    } else {
        users.findOne({ email: user.email }, function(err, existinguser) {
            if (existinguser == null) {
                console.log("email=" + req.body.email);

                var email = function ValidateEmail(mail) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
                        var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address, "status": "activated" });
                        //firstName, lastName, email, address, city, password, status
                        console.log("user1=" + user1);
                        //creating new user data
                        users.create(user1, function(err, data) {
                            if (!data) {
                                console.log("error in posting data");
                                res.send("data not added");
                            } else {
                                // res.json(data);
                                res.send("data inserted");
                            }
                        })
                    } else {
                        res.json(" invalid email_id  try other value");
                    }
                }();
            } else {
                res.json("already existing  email_id  try other value");
            }
        })
    }

})


//delete
app.delete('/user/:id', function(req, res) {
    console.log("calling delete ");
    let id = req.params.id;
    async.series([
        function(callback) {
            if (req.session.email != null) {
                users.find({ $or: [{ "_id": id }, { "email": id }] }, function(err, docs) {
                    if (docs.length !== 0) {
                        callback();
                    } else {
                        callback('user does not exist');
                    }
                })
            }
        },
        function(callback) {
            users.remove({ $or: [{ "_id": id }, { "email": id }] }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    callback(null, 'DataDeleted Successfully')
                }
            })
        }

    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data[1]);
        }
    })
})



app.get("/user/:id", function(req, res) {
    var id = req.params.id;
    console.log("inside connect.js user app for edit" + id)
    users.findOne({ "_id": id }, function(err, docs) {
        console.log(docs);
        res.send(docs);
    });
})

//put
//put by email/id
app.put('/user/:id', function(req, res) {
    console.log("in connect for update=");
    let id = req.params.id;
    var user = req.body;
    console.log("user=" + user)
    console.log("id in connect for update=" + id);

    async.series([
            function(callback) {
                if (req.session.email != null) {
                    users.find({ 'email': req.body.email },
                        function(err, docs) {
                            console.log(docs);
                            if (docs.length > 0) {
                                callback()
                            } else {
                                callback('Data not found to Update');
                            }
                        })
                }
            },
            function(callback) {
                users.update({ 'email': req.body.email }, { '$set': { firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address } },
                    function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback()
                        }
                    })
            },
            function(callback) {
                users.find({ '_id': id },
                    function(err, docs) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback(null, docs)
                        }
                    })
            },

        ],
        function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data[2]);
            }
        })
})

//deactivate put
app.put("/user1/:_id", function(req, res) {
        // var email = req.params.email;
        console.log("in connect for deactivate put ");
        console.log("id=" + req.params._id);
        users.findOne({ _id: req.params._id }, function(err, existinguser) {
            if (existinguser == null) {
                res.send(" id not exist");
            } else {
                users.updateOne({ _id: req.params._id }, { $set: { "status": req.body.status } }, function(err, data) {
                    if (!data) {
                        console.log("not updated");
                        res.send("not updated");
                    } else {
                        res.send("data inserted");
                    }
                })

            }
        })

    })
    ///// company

//get
app.get("/company", function(req, res) {

    console.log("inside connect.js company app")
    if (req.session.email != null) {
        companys.find({}, function(err, docs) {
            console.log("company=" + docs);
            res.send(docs);
        });
    } else {
        res.send("nouser");
    }
})

//post
app.post("/company", function(req, res) {
    var company1 = req.body;
    console.log("company1=" + company1);
    users.find({ "companyName": company1.companyName }, function(error, data) {
        console.log("doc=" + data);
        if (data.length <= 0) {
            console.log("create cmp data");
            var cmp1 = new companys({ "companyInfo.RegistartionNo": req.body.companyInfo.RegistartionNo, "companyName": req.body.companyName, "status": "activated" });
            console.log("cmp1=" + cmp1);
            companys.create(cmp1, function(error, data) {
                // companys.create({company1}, function(err, data) {
                console.log("data in save = " + data);
                console.log("cmp1 in save =" + company1);
                if (!data) {
                    console.log("error in posting data");
                    res.send("data not added");
                } else {
                    res.send(data);
                }
            })
        } else {
            //res.send('User not exist');
            res.send(error);
        }
    })
})

///delete 
app.delete('/company/:id', function(req, res) {
    console.log("calling delete ");
    let id = req.params.id;
    async.series([
        function(callback) {

            companys.find({ "_id": id }, function(err, docs) {
                if (docs.length !== 0) {
                    callback();
                } else {
                    callback('company does not exist');
                }
            })
        },
        function(callback) {
            companys.remove({ "_id": id }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    callback(null, 'Data Deleted Successfully')
                }
            })
        }

    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data[1]);
        }
    })
})

//edit
app.get("/company/:id", function(req, res) {
    var id = req.params.id;
    console.log("inside connect.js cmp app for edit" + id)
    companys.findOne({ "_id": req.params.id }, function(err, docs) {
        console.log("data=" + docs);
        res.send(docs);
    });
})

//update
//put 
app.put('/company/:id', function(req, res) {
    console.log("in connect for update=");
    let id = req.params.id;
    var cmp = req.body;
    console.log("cmp=" + cmp)
    console.log("id in connect for update=" + id);
    async.series([
            function(callback) {
                companys.find({ '_id': req.params.id },
                    function(err, docs) {
                        console.log(docs);
                        if (docs.length > 0) {
                            callback()
                        } else {
                            callback('Data not found to Update');
                        }
                    })
            },
            function(callback) {
                companys.update({ '_id': req.params.id }, { '$set': { companyName: req.body.companyName, "companyInfo.RegistartionNo": req.body.companyInfo.RegistartionNo } },
                    function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback()
                        }
                    })
            },
            function(callback) {
                companys.find({ '_id': id },
                    function(err, docs) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback(null, docs)
                        }
                    })
            },

        ],
        function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data[2]);
            }
        })
})

//deactivate put
app.put("/company1/:_id", function(req, res) {
    // var email = req.params.email;
    console.log("in connect for deactivate put ");
    console.log("id=" + req.params._id);
    companys.findOne({ _id: req.params._id }, function(err, existinguser) {
        if (existinguser == null) {
            res.send(" id not exist");
        } else {
            companys.updateOne({ _id: req.params._id }, { $set: { "status": req.body.status } }, function(err, data) {
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send("data inserted");
                }
            })

        }
    })
})

var server = app.listen(8044, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})