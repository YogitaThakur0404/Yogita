var express = require('express');
var app = express();
var fs=require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));

let data = require('/Users/Yogita/Desktop/yogita/nodejs/CRUD/users.json');

let datas = require('./users');

// 1.This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

// 2.This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   //console.log("Got a GET request for /list_user");
   fs.exists('users.json', function(exists) {
    if(exists) {
      //Show
      console.log('File exists....');
      fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log( data );
        res.send( data );
    });
      
    } else {
     
      console.log('File not found');
      res.send("File not found" );
    }
  });


})

app.post('/users', function (req, res) {

    var user = {
        name:req.body.name,
        password:req.body.password,
       profession:req.body.profession,
       id:req.body.id
     
      }
 
      console.log("user="+user);
   

 fs.exists('users.json', function(exists) {
    if(exists) {
      //Show
      console.log('File exists....');
     
       // First read existing users.
       fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
         
        data = JSON.parse( data );
        // data = user;
         data.users.push(user);
           console.log( "data="+data );
           console.log("user"+user );

           var json = JSON.stringify(data); 
            fs.writeFile('users.json', json); 
           res.send( JSON.stringify(data));
  
       });
      
    } else {
     
      console.log('File not found');
      res.send("File not found" );
    }
  });




    })
  //put

app.put('/users/:id', function(req, res)  {

    fs.exists('users.json', function(exists) {
        if(exists) {
          //Show
          console.log('File exists....');
          const user = data.users.find(x => x.id === parseInt(req.params.id));
          if(!user) {
              res.send('data not found');
              return;
          }
          
          //ok  update 
          user.name = req.body.name;
          user.password = req.body.password;
          user.profession = req.body.profession;
          
          console.log("name="+user.name);
          console.log(" pwd="+user.password);
          console.log("profession="+user.profession);
          //send it
          
          res.send(data);//correct data
          var json = JSON.stringify(data); 
          fs.writeFile('users.json', json); 
          res.end( JSON.stringify(data));

        } else {
         
          console.log('File not found');
          res.send("File not found" );
        }
      });
    



    
      });
    
   
//delete data


app.delete('/users/:id', function (req, res)  {
    fs.exists('users.json', function(exists) {
        if(exists) {
          //Show
          console.log('File exists....');
          let id = req.params.id;
   

          const user = data.users.find(x => x.id === parseInt(req.params.id));
          if(!user) {
              res.send('data not found');
              return;
          }
          //to delete
              const index = data.users.indexOf(user);
          data.users.splice(index,1);
      //res.send("data deleted");
      res.send(data);//correct data
      var json = JSON.stringify(data); 
      fs.writeFile('users.json', json); 
      res.end( JSON.stringify(data));
          
        } else {
         
          console.log('File not found');
          res.send("File not found" );
        }
      });
    
  
   
  
  });
  

var server = app.listen(8083, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})