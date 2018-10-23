var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({ secret: "Your secret key", cookie: { maxAge: 3600000 }, saveUninitialized: true, resave: true }));
var users = require("./user.model")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userdb1");

var methods = {};

methods.getName = function(req, res, next) {
        var name = req.body.firstName.toUpperCase();
        console.log(name);
        next();
    }
    //create user data
methods.insertData = function(req, res, next) {
    var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address, "status": "activated" });
    //creating new user data
    users.create(user1, function(error, data) {
        console.log("data=" + data);
        // console.log("data len=" + data.length)
        if (error) {
            res.send("data not added");
        } else {
            res.send("user")
            next();
        }
    })
}

module.exports = methods;