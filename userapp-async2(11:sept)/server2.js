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
        function(callback,error) {
           fs.exists('users.json', function(exists,err) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
                    console.log( data );
                     data=JSON.parse(data);
                    callback(null,data);
                  });
                  
                } else {
                    callback(null,error);
                  console.log('File not found');
                 }
              });
          },
       ], function(error, data) {
               if(error){
                        res.send("ERROR:File not Found" );

                       }
                         res.send(data);
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
                            console.log("users="+users)
                            var user = users.users[req.params.id] 
                            console.log( user );
                            callback(null,user);
                       
                        });
                  
                } else {
                    console.log('File not found');
                    callback(null, "ERROR:File not Found");
               
                }
              });
      },
   ], function(err, data) {
        if(err){
            res.send(err );
         }
          else{
         res.send(data);
          }
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

            fs.exists('users.json', function(exists,err) {
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
                    data.users.push(user);
                    var json = JSON.stringify(data); 
                   fs.writeFile('users.json', json);
                    callback(null,JSON.stringify(data));
                     
                  });
                 
                } else {
                    console.log('File not found');
                     callback(err);
                        }
              });
        },
        
      ], function(err, data) {

        if(err){
            res.send(err );

          }
          else{
            data = JSON.parse( data );
            res.send(data);
          }
       
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
                   var json = JSON.stringify(data); 
                  fs.writeFile('users.json', json); 
                   callback(null,JSON.stringify(data));
                
                  });
               } else {
                    console.log('File not found');
                    callback(err);
                
                }
              });
     
        },
        
      ], function(err, data) {

        if(err){
            res.send(err );
       }
          else{
             data = JSON.parse( data );
            res.send(data);
          }
      
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
                  console.log('id='+id);
                  fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
                    let id = req.params.id;
                    console.log('in read file id='+id);
                    data = JSON.parse( data );
                    console.log("data="+data);
                  const user = data.users.find(x => x.id === parseInt(req.params.id));
                  if(!user) {
                      res.send('data not found');
                      return;
                  }
                  //to delete
                      const index = data.users.indexOf(user);
                  data.users.splice(index,1);
            
               var json = JSON.stringify(data); 
              fs.writeFile('users.json', json); 
              callback(null,JSON.stringify(data));
           
                });  
                } else {
                 
                    console.log('File not found');
                  callback(err);
               
                }
              });
   
        },
        
      ], function(err, data) {

        if(err){
            res.send(err );

          }
          else{
          
            data = JSON.parse( data );
            res.send(data);
          }
       
      });
 })

 var server = app.listen(8091, function () {
    var host = server.address().address
   var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

