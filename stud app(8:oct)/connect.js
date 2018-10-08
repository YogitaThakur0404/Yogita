var express = require('express');
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

var async = require('async');

var students = require("./student.model")
var admindata = require("./admin.model")
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/studentdb"); //company database
//mongoose.connect("mongodb://localhost/companydb");


app.use(express.static(__dirname + "/angular"));
//app.use("/all", router);


app.post("/", function(req, res) {

    console.log("email=" + req.body.email);
    console.log("pwd=" + req.body.password);

    console.log("inside login connect.js user app")
    students.find({ $and: [{ "email": req.body.email }, { "password": req.body.password }] }, function(err, docs) {
        console.log("leng=" + docs.length);
        if (docs.length > 0) {
            res.redirect('#!student');
            // res.send("admin")

        } else {
            var data = { "msg": "invalid credentials" };
            console.log("invalid cond login=" + docs.length);
            // res.send("/");
            res.redirect('/');
        }

    });
})

app.get("/student", function(req, res) {

    console.log("inside connect.js student app")
    students.find({}, function(err, docs) {
        console.log(docs);
        res.send(docs);
    });
})

//post
app.post("/student", function(req, res) {
    var user = req.body;
    // console.log("user=" + user);
    console.log("user email =" + user.email);
    async.series([
        function(callback) {
            students.findOne({ email: user.email }, function(err, existinguser) {
                if (existinguser == null) {
                    console.log("email=" + req.body.email);
                    callback();

                } else {
                    callback("already existing  email_id  try other value");
                    //res.json("already existing  email_id  try other value");
                }
            })
        },
        function(callback) {
            var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "studentInfo.city": req.body.studentInfo.city, "studentInfo.address": req.body.studentInfo.address, "status": "pass" });
            //firstName, lastName, email, address, city, password, status
            console.log("user1=" + user1);
            //creating new user data
            users.create(user1, function(err, data) {
                if (!data) {
                    console.log("error in posting data");
                    // res.send("data not added");
                    callback("error while adding new data");
                } else {
                    // res.json(data);
                    //  res.send("data inserted");
                    callback(null, data);
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

/*







app.delete('/user/:id', function(req, res) {
    console.log("calling delete ");
    let id = req.params.id;
    async.series([
        function(callback) {

            users.find({ $or: [{ "_id": id }, { "email": id }] }, function(err, docs) {
                if (docs.length !== 0) {
                    callback();
                } else {
                    callback('user does not exist');
                }
            })
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
        // console.log("user data=" + user.data)

    console.log("id in connect for update=" + id);
    // console.log("name in connect for update=" + user.firstName);
    // console.log("name in connect for update=" + req.body.firstName);

    async.series([
            function(callback) {
                users.find({ 'email': req.body.email },
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

// //activate
// //activate put
// app.put("/userss/:_id", function(req, res) {
//         // var email = req.params.email;
//         console.log("user: in connect for activate put ");
//         console.log("id=" + req.params._id);

//         users.findOne({ _id: req.params._id }, function(err, existinguser) {
//             if (existinguser == null) {
//                 res.send(" id not exist");
//             } else {
//                 users.updateOne({ _id: req.params._id }, { $set: { "status": "activated" } }, function(err, data) {
//                     if (!data) {
//                         console.log("not updated");
//                         res.send("not updated");
//                     } else {
//                         res.send("data inserted");
//                     }
//                 })

//             }
//         })

//     })
///// company

//get
app.get("/company", function(req, res) {

    console.log("inside connect.js company app")
    companys.find({}, function(err, docs) {
        console.log("company=" + docs);
        res.send(docs);
    });
})

//post

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
        // console.log("user data=" + user.data)
    console.log("id in connect for update=" + id);
    // console.log("name in connect for update=" + user.firstName);
    // console.log("name in connect for update=" + req.body.firstName);
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

//deactivate
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
    //activate

// //activate
// //activate put
// app.put("/companys/:_id", function(req, res) {
//     // var email = req.params.email;
//     console.log("in connect for activate put ");
//     console.log("id=" + req.params._id);
//     companys.findOne({ _id: req.params._id }, function(err, existinguser) {
//         if (existinguser == null) {
//             res.send(" id not exist");
//         } else {
//             companys.updateOne({ _id: req.params._id }, { $set: { "status": "activated" } }, function(err, data) {
//                 if (!data) {
//                     console.log("not updated");
//                     res.send("not updated");
//                 } else {
//                     res.send("data inserted");
//                 }
//             })

//         }
//     })
// })
*/


var server = app.listen(8050, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})