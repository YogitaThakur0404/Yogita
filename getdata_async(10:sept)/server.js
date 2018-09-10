var express = require('express');
var app = express();
var fs=require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
 app.use(express.static('public'));
 //var async = require('async');

 //async.series([

 app.get("/list_user",async function get(req, res, next) {
 function getData(callback) {
   fs.readFile('users.json', 'utf8', function(err, data) {
     if (err)
       callback(err);
       
     callback(null, data);
   });
 }
 
 getData(function(err, data) {
     if (err) {
       console.log('An error occurred while trying to retrieve users.json content.');
     }
     res.send( data );
     console.log(data);
   
 });
 
 console.log('test message');
 }) 
//])


var server = app.listen(8082, function () {
    var host = server.address().address
   var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})