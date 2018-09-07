var express = require('express');
var app = express();
var fs = require("fs");

//Get users /users with id
app.get('/users', function (req, res) {
  
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.query.id] 
      console.log( user );
      res.end( JSON.stringify(user));
   });

})

var server = app.listen(8047, function () {

   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})