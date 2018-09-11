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

 async.series([
   function(callback) {
       
     setTimeout(function() {
        app.get("/show",function (req, res) {
            fs.exists('users.json', function(exists) {
                if(exists) {
                  //Show
                  console.log('File exists....');
                  
                  
                } else {
                 
                  console.log('File not found');
                  res.send("File not found" );
                }
              });
        
         })
       console.log("check for file");
       callback(null, 1);
     }, 300);
   },
   //list all users
   function(callback) {
     setTimeout(function() {
        app.get('/list_user', function (req, res) {

            fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
                console.log( data );
                res.send( data );
            });})
      console.log("get all");
      callback(null, 2);
    }, 300);
        
      
   },
   //3. get by id
   function(callback) {
    setTimeout(function() {
//required  parameter  id 
app.get('/users/:id', function (req, res) {
  
    // First read existing users.
  
  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     var users = JSON.parse( data );
     var user = users.users[req.params.id] 
     console.log( user );
     res.end( JSON.stringify(user));
  });
  
  
  })
      console.log("get by id");
      callback(null, 3);
    }, 100);
  },
  //4. post
  function(callback) {
    setTimeout(function() {


        app.post('/users', function (req, res) {
            var user = {
               name:req.body.name,
               email:req.body.email,
              profession:req.body.profession,
              id:req.body.id
            
             }
        
             console.log("user="+user);
          
              // First read existing users.
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
             
           
         });
        
      console.log("post");
      callback(null, 4);
    }, 100);
  },
//put
  function(callback) {
    setTimeout(function() {

 
        app.put('/users/:id', function(req, res)  {
            let id = req.params.id;
            console.log("id in put="+id);
              
                    fs.readFile( __dirname + "/" + "users.json","utf8", function (err, data) {
                       data = JSON.parse( data );
                     
                
                      console.log("id in read="+id);
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
              
            
                });
          

      console.log("put");
      callback(null, 5);
    }, 100);
  },
  //delete

// 5.This responds a DELETE request for the /users/id page.
  function(callback) {
    setTimeout(function() {
        app.delete('/users/:id', function (req, res)  {
   
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
     
      
    
    });

      console.log("delete");
      callback(null, 5);
    }, 100);
  }
 ], function(error, results) {
   console.log(results);
 });
 
 var server = app.listen(8082, function () {
    var host = server.address().address
   var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

