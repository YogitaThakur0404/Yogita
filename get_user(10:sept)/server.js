var express = require('express');
var app = express();
var fs = require("fs");

//Get users /users with id
app.get('/users', function (req, res) {
  
   // First read existing users.
//   
fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    var users = JSON.parse( data );
   // var user = users["user" + req.query.id] 
    console.log( users );
    res.end( JSON.stringify(users));
 });


})
//required  parameter  id 
app.get('/users/:id', function (req, res) {
  
    // First read existing users.
  
 fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     var users = JSON.parse( data );
     var user = users["user" + req.params.id] 
     console.log( user );
     res.end( JSON.stringify(user));
  });
 
 
 })

 //optinal parameter  pwd and profession 
app.get('/users/:id/:name/:password?/:profession?', function (req, res) {
  
    // First read existing users.
  
 fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    var users = JSON.parse( data );
   
 var user = {
    name:req.params.name,
    password:req.params.password,
   profession:req.params.profession,
   id:req.params.id
 
  }
  console.log( user );
  res.end( JSON.stringify(user));


 });



 
 })
var server = app.listen(8042, function () {

   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})