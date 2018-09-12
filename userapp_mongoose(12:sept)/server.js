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

// 4.This responds a POST request for the /users page.
app.post("/users", function(req, res) {
    var user = req.body;
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
            res.json("already existing id try other value")
        }
    })

})

// 5.This responds a PUT request for the /users/id page.
app.put("/users/:id", function(req, res) {
    var id1 = req.params.id;
    console.log("id1=" + id1);
    users.findOne({ id: req.params.id }, function(err, existinguser) {
        if (existinguser == null) {
            res.send("not updated id not exist");
        } else {
            users.findOneAndUpdate({ id: req.params.id }, { $set: { name: req.body.name, email: req.body.email } }, { upsert: true }, function(err, data) {
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send("updated successfully");
                }
            })

        }
    })

})

// 6.This responds a delete request for the /users/id page.
app.delete("/users/:id", function(req, res) {

    users.findOneAndRemove({ id: req.params.id }, function(err, data) {
        if (!data) {
            console.log("Id not exist");
            res.send("Id not exist to delete ");
        } else {
            console.log("deleted successfully");
            res.send("deleted successfully");
        }
    })

})



var server = app.listen(8095, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})