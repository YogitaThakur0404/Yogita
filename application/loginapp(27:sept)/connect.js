var express = require('express');
var app = express();
var router = express.Router();

var fs = require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var query = require('querystring');
app.use(express.static('public'));

var async = require('async');

var users = require("./user.model")
var companys = require("./company.model")
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/userdb1"); //company database
mongoose.connect("mongodb://localhost/companydb1");


app.use(express.static(__dirname + "/angular"));
app.use("/all", router);

router.get("/user", function(req, res) {

    users.find({}, function(err, docs) {
        console.log(docs);
        res.send(docs);
    });
})

var server = app.listen(8055, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})