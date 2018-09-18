var express = require('express');
var app = express();
var fs = require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//var query = require('querystring');
app.use(express.static('public'));
var async = require('async');

var users = require("./user.model")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/usersdb"); //users database

// 1.This responds a GET request for the / page.
app.get("/", function(req, res) {
    res.end("get method calling");
})

// 2.This responds a GET request for the /show page for all users.
app.get("/show", function(req, res) {
    console.log("get all users");
    async.series([
        function(callback) {
            users.find({}, function(err, data) {
                if (data) {
                    console.log("users=" + data);
                    callback(null, data);
                } else {
                    callback("error : Data not found");
                }
            })
        },
    ], function(error, data) {

        if (!data) {
            res.send("error : Data not found");
        } else {
            res.send(data);
        }
    });
})


// 3. This responds a GET request for the /users/email page by query parameters
app.get("/users/:id?/:email?", function(req, res) {

    console.log("get single user by email/id");
    async.series([
        function(callback) {

            console.log("email id=" + req.query.email);
            if (req.query.email != null) { // get by email
                users.findOne({
                    email: req.query.email

                }, function(err, data) {
                    if (!data) {
                        callback("email_id not found");
                    } else {
                        console.log("users=" + data);
                        callback(null, data);
                    }
                });
            }
            console.log(" id=" + req.query.id);
            if (req.query.id != null) { // get by id
                users.findOne({
                    id: req.query.id
                }, function(err, data) {
                    if (!data) {
                        callback("id not found");
                    } else {
                        console.log("users=" + data);
                        callback(null, data);
                    }
                })
            }
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})

// 4 This responds a POST request for the /users page by email . 
app.post("/users", function(req, res) {
    var user = req.body;
    async.series([
        function(callback) {
            users.findOne({ email: user.email }, function(err, existinguser) {
                if (existinguser == null) {
                    users.findOne({ id: user.id }, function(err, existinguser) {
                        if (existinguser == null) {
                            users.create(req.body, function(err, data) {
                                if (!data) {
                                    console.log("error in posting data");
                                    callback("data not added");
                                } else {
                                    callback(null, data);
                                }
                            })
                        } else {
                            callback("already existing  id  try other value");
                        }
                    })
                } else {
                    callback("already existing  email_id  try other value");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})

// 5 This responds a PUT request for the /users page by email . 
app.put("/users/:id", function(req, res) {
    var id = req.params.id;
    console.log("id=" + id);
    async.series([
        function(callback) {
            users.findOne({ id: req.params.id }, function(err, existinguser) {
                if (existinguser != null) {
                    users.updateOne({ id: req.params.id }, { $set: { name: req.body.name, email: req.body.email } }, function(err, data) { //updating by updateOne()
                        if (!data) {
                            console.log("not updated");
                            callback("not updated");
                        } else {
                            callback("updated successfully");
                        }
                    })
                } else {
                    callback(" id not found  try other value");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})

// 6 This responds a DELETE request for the /users page by email . 
app.delete("/users/:id", function(req, res) {
    var id = req.params.id;
    console.log("id=" + id);
    async.series([
        function(callback) {
            users.remove({ id: req.params.id }, function(err, data) { //remove()
                if (!data) {
                    console.log("not deleted");
                    callback("not deleted");
                } else {
                    callback("deleted successfully");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})

var server = app.listen(8045, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})