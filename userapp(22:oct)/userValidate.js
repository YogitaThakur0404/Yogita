var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

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

//validate email
methods.ValidateEmail = function(req, res, next) {
    console.log("valid email call");
    if (!req.session.docs) {
        return res.status(404).send();
    } else {
        users.findOne({ email: req.body.email }, function(err, existinguser) {
            if (existinguser == null) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
                    next()
                } else {
                    res.send("invalid");
                }
            } else {
                res.send("exist")

            }
        })
    }
}


module.exports = methods;