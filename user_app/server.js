var express = require('express');
var app = express();
var fs=require("fs");

var bodyParser = require('body-parser');
//added for post
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

// This responds a POST request for the homepage


app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.body.first_name,
      password:req.body.password,
      profession:req.body.profession,
      id:req.body.id
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

 

// This responds a DELETE request for the /deleteUser page.
app.get('/deleteUser', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   //res.send('Hello DELETE');

var id = 2;
   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 2];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
})


// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   //console.log("Got a GET request for /list_user");
  // res.send('Page Listing');

   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );

})
})


var server = app.listen(8083, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})