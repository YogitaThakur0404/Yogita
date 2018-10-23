var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var promise = require("promise");
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

//get all users
app.get("/user", function(req, res) {
    return new promise(function(resolve, reject) {
            users.find({}, function(error, data) {
                console.log("data=" + data.length);
                if (data.length > 0) {
                    console.log('Query executed');
                    resolve(data);
                } else {
                    console.log('no data found');
                    reject(error);
                }
            })

        }).then(function(data) {
            res.send(data);
        })
        .catch(function(error) {
            console.log(error);
            res.send("no data found");
        });
})

//get by name
app.get("/user/:firstName", function(req, res) {
    return new promise(function(resolve, reject) {
            users.find({ "firstName": req.params.firstName }, function(error, data) {
                console.log("data=" + data.length);
                if (data.length > 0) {
                    console.log('Query executed');
                    resolve(data);
                } else {
                    console.log('no data found');
                    reject(error);
                }
            })

        }).then(function(data) {
            res.send(data);
        })
        .catch(function(error) {
            console.log(error);
            res.send("no data found");
        });
})

//post
app.post("/user", function(req, res) {
    var user = req.body;
    return new promise(function(resolve, reject) {
            users.findOne({ email: user.email }, function(err, existinguser) {
                if (existinguser == null) {
                    console.log("exist user" + existinguser);

                    var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address, "status": "activated" });
                    users.create(user1, function(err, data) {
                        console.log("data=" + data.length);
                        if (data) {
                            resolve(data);
                        } else {
                            console.log("not inserted")
                            reject(err);
                        }
                    })
                } else {
                    console.log("already existing  email_id  try other value");
                    reject(err);
                }
            })

        }).then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            console.log(err);
            res.send("error");
        })
})

//delete
app.delete('/user/:id', function(req, res) {

    let id = req.params.id;
    return new promise(function(resolve, reject) {
            users.find({ "_id": id }, function(error, data) {
                if (data == undefined) {
                    reject(error);
                } else if (data.length !== 0) {
                    resolve(data);
                } else {
                    reject(error)
                }
            })
        }).then(function(data) {
            users.remove({ $or: [{ "_id": id }, { "email": id }] }, function(error) {
                if (error) {
                    reject(error);
                } else {
                    res.send("deleted")
                }
            })
        })
        .catch(function(error) {
            console.log(error);
            res.send("user does not exist");
        })

})
var server = app.listen(8054, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})