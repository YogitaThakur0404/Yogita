var express = require('express');
var app = express();
var fs=require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
 app.use(express.static('public'));
 
 var async = require('async');
 // 1.This responds a GET request for the /show page.

 app.get("/show",function (req, res) {

    async.series([
        function(callback) {
         
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
          callback(null, 1);
        },
        
      ], function(error, results) {
        console.log(results);
      });
 })


  // 2.This responds a GET request for the /users/id page.
 app.get("/users/:id",function (req, res) {

    async.series([
        function(callback) {
         
            fs.exists('users.json', function(exists) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    var users = JSON.parse( data );
    var user = users.users[(req.params.id)] 
    console.log( user );
    res.end( JSON.stringify(user));
 });
                  
                } else {
                 
                  console.log('File not found');
                  res.send("File not found" );
                }
              });
          callback(null, 1);
        },
        
      ], function(error, results) {
        console.log(results);
      });
 })

 //post
// 3.This responds a POST request for the /users page.

 app.post('/users', function (req, res){

    async.series([
        function(callback) {
         
            var user = {
                name:req.body.name,
                email:req.body.email,
               profession:req.body.profession,
               id:req.body.id
             
              }
         
              console.log("user="+user);

            fs.exists('users.json', function(exists) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                 
                  fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
                    console.log("id in file ="+user.id);
                   data = JSON.parse( data );
                   const user1 = data.users.find(x => x.id === parseInt(user.id));
                       console.log("user1="+user1);
    
                   if(user1) {
                       res.send('id  already available please enter another value');
                       return;
                   }
    
    
                   // data = user;
                    data.users.push(user);
                     // console.log( "data="+data );
                     // console.log("user"+user );
                       var json = JSON.stringify(data); 
                       fs.writeFile('users.json', json); 
                      res.send( JSON.stringify(data));
             
                  });
  
                  
                } else {
                 
                  console.log('File not found');
                  res.send("File not found" );
                }
              });
          callback(null, 1);
        },
        
      ], function(error, results) {
        console.log(results);
      });
 })





 // 4.This responds a GET request for the /users/id page.

 app.put('/users/:id', function(req, res){

    async.series([
        function(callback) {
                   

            fs.exists('users.json', function(exists) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                  let id = req.params.id;
            console.log("id in put="+id);
                  fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
                    
                   data = JSON.parse( data );
                   const user = data.users.find(x => x.id === parseInt(req.params.id));
                       
    
                       if(!user) {
                        res.send('data not found');
                        return;
                    }
    
    
                   //ok  update 
                   user.name = req.body.name;
                   user.email = req.body.email;
                   user.profession = req.body.profession;
                   
                   console.log("name="+user.name);
                  
                   console.log("profession="+user.profession);
                   //send it
                   
                   res.send(data);//correct data
                   var json = JSON.stringify(data); 
                   fs.writeFile('users.json', json); 
                   res.end( JSON.stringify(data));
                  });
  
                  
                } else {
                 
                  console.log('File not found');
                  res.send("File not found" );
                }
              });
          callback(null, 1);
        },
        
      ], function(error, results) {
        console.log(results);
      });
 })


   //delete data
 // 5.This responds a DELETE request for the /users/id page.
app.delete('/users/:id', function (req, res) {

    async.series([
        function(callback) {
         
            fs.exists('users.json', function(exists) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                  let id = req.params.id;
           
                  fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
                 
                    data = JSON.parse( data );
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
                });  
                } else {
                 
                  console.log('File not found');
                  res.send("File not found" );
                }
              });
          callback(null, 1);
        },
        
      ], function(error, results) {
        console.log(results);
      });
 })

 var server = app.listen(8085, function () {
    var host = server.address().address
   var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

