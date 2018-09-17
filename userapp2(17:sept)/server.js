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
    users.find({}, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})

// 3.This responds a GET request for the /users/id page.
app.get("/users/:id", function(req, res) {
    console.log("get single user");
    users.findOne({
        id: req.params.id
    }, function(err, data) {
        if (!data) {
            res.send("error : id not exist ");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})


// 3.1 This responds a GET request for the /users/email page.
app.get("/users/:email", function(req, res) {
    var email = req.params.email;
    console.log("email id=" + email);
    console.log("get single user by email");
    users.findOne({
        email: req.params.email
    }, function(err, data) {
        if (!data) {
            res.send("error : user not exist ");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})

// 4 This responds a POST request for the /users page by email . 
app.post("/users", function(req, res) {
    var user = req.body;
    users.findOne({ email: user.email }, function(err, existinguser) {
        if (existinguser == null) {
            users.findOne({ id: user.id }, function(err, existinguser) {
                if (existinguser == null) {
                    users.create(req.body, function(err, data) {
                        if (!data) {
                            console.log("error in posting data");
                            res.send("data not added");
                        } else {
                            res.json(data);
                        }
                    })
                } else {
                    res.json("already existing  id  try other value");
                }
            })
        } else {
            res.json("already existing  email_id  try other value");
        }
    })

})

// 5 This responds a PUT request for the /users page by email . 
app.put("/users/:id", function(req, res) {
    var id = req.params.id;
    console.log("id=" + id);
    users.findOne({ id: req.params.id }, function(err, existinguser) {
        if (existinguser != null) {
            users.updateOne({ id: req.params.id }, { $set: { name: req.body.name, email: req.body.email } }, function(err, data) { //updating by updateOne()
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send("updated successfully");
                }
            })
        } else {
            res.json(" id not found  try other value");
        }
    })

})

// 6 This responds a DELETE request for the /users page by email . 
app.delete("/users/:id", function(req, res) {
    var id = req.params.id;
    console.log("id=" + id);
    users.findOne({ id: req.params.id }, function(err, existinguser) {
        if (existinguser != null) {
            users.remove({ id: req.params.id }, function(err, data) { //remove()
                if (!data) {
                    console.log("not deleted");
                    res.send("not deleted");
                } else {
                    res.send("deleted successfully");
                }
            })
        } else {
            res.json("  id not found  try other value");
        }
    })
})

var server = app.listen(8059, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})