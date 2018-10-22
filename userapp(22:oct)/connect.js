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
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userdb1"); //user database

app.use(express.static(__dirname + "/angular"));
var userValidate = require('./userValidate.js');
var userController = require('./ userController.js');

app.post("/", function(req, res) {
    req.session.email = req.body.email;
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
            } else {
                req.session.docs = docs;
                res.status("400");
                res.redirect('/');
            }
        });
    }
})

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
    } else {
        res.send("nouser");
    }
})

//post
app.post("/user", [userValidate.ValidateEmail, userController.insertData]);


//delete
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



//put by email/id
app.put('/user/:id', function(req, res) {
    console.log("in connect for update=");
    let id = req.params.id;
    var user = req.body;
    console.log("user=" + user)
    console.log("id in connect for update=" + id);
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

var server = app.listen(8052, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})