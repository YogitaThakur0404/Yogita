var express = require('express');
var app = express();
app.use(express.json());
var bodyParser = require('body-parser');
const User = require('./user.model');
const company = require('./company.model');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var async = require('async');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userdb1');
//mongoose.connect("mongodb://localhost/userdb1");
var db = mongoose.connection;

db.once('open', function() { console.log("Connected to MongoDb"); })

db.on('error', function(err) { console.log(err); })

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {

    res.send("on index page");
})

app.get('/user', function(req, res) {

    async.series([
        function(callback) {
            User.find({ status: 'activated' }, function(err, docs) {
                console.log("user data=" + docs);
                callback(null, docs);
            })
        }
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
})

//post
app.post("/user", function(req, res) {
    var user = req.body;
    console.log("user=" + user);
    console.log("user email =" + user.email);

    User.findOne({ email: user.email }, function(err, existinguser) {
        if (existinguser == null) {
            console.log("email=" + req.body.email);

            var email = function ValidateEmail(mail) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
                    var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address, "status": "activated" });
                    //firstName, lastName, email, address, city, password, status
                    console.log("user1=" + user1);
                    //creating new user data
                    User.create(user1, function(err, data) {
                        if (!data) {
                            console.log("error in posting data");
                            res.send("data not added");
                        } else {
                            // res.json(data);
                            res.send("data inserted");
                        }
                    })
                } else {
                    res.json(" invalid email_id  try other value");
                }
            }();
        } else {
            res.json("already existing  email_id  try other value");
        }
    })
})

//put by email

app.put("/user/:email", function(req, res) {
    var email = req.params.email;
    console.log("email=" + email);

    User.findOne({ email: req.params.email }, function(err, existinguser) {
        if (existinguser == null) {
            res.send("id not exist");
        } else {
            User.updateOne({ email: req.params.email }, { $set: { firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address } }, function(err, data) {
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    //res.send(data);
                    res.send("data inserted");
                }
            })

        }
    })

})


//put by emil/id
app.put('/user/:id', function(req, res) {

    let id = req.params.id;

    let email = req.body.email;
    let userName = req.body.userName;
    let address = req.body.address;

    async.series([
            function(callback) {
                User.find({ 'email': email },
                    function(err, docs) {
                        console.log(docs);
                        if (docs.length > 0) {
                            callback()
                        } else {
                            callback('Data not found to Update');
                        }
                    })
            },
            function(callback) {
                User.update({ 'email': email }, { '$set': { 'userInfo.userName': userName, 'userInfo.address': address, 'status': status, 'password': password } },
                    function(err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback()
                        }
                    })
            },
            function(callback) {
                User.find({ '_id': id },
                    function(err, docs) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            callback(null, docs)
                        }
                    })
            },

        ],
        function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data[2]);
            }
        })
})


app.delete('/user/:id', function(req, res) {
    console.log("calling delete ");
    let id = req.params.id;
    async.series([
        function(callback) {

            User.find({ $or: [{ "_id": id }, { "email": id }] }, function(err, docs) {
                if (docs.length !== 0) {
                    callback();
                } else {
                    callback('user does not exist');
                }
            })
        },
        function(callback) {
            User.remove({ $or: [{ "_id": id }, { "email": id }] }, function(err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    callback(null, 'DataDeleted Successfully')
                }
            })
        }

    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data[1]);
        }
    })
})


//////company



app.get('/company', function(req, res) {

    async.series([
        function(callback) {
            company.find({ status: 'activated' }, function(err, docs) {
                console.log(docs);
                callback(null, docs);
            })
        }
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
})








app.listen(3027, () => console.log('Listening on port 3027'));