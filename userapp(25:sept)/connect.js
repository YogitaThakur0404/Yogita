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
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userdatabase"); //company database



app.use("/show", router);

//get all users
router.get("/user", function(req, res) {
    console.log("get all users");
    async.series([
        function(callback) {
            users.find({}, function(error, data) {
                if (data.length < 0) {
                    // res.send(error);
                    callback(error);
                } else if (data.length > 0) {
                    console.log("users=" + data);
                    callback(null, data);
                } else {
                    callback("error");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send("ERROR:data not Found");
        }
        res.send(data);
    });
})


//should match all the userName with the pattern starting with the :searchPattern parameter
router.get('/users/:searchPattern', function(req, res) {
    let searchPattern = req.params.searchPattern;
    async.series([
        function(callback) {
            users.find({ 'userName': { '$regex': searchPattern, '$options': 'i' } }, function(err, data) {
                if (!data) {
                    console.log("data not found");
                    callback("data not found");
                } else {
                    callback(null, data);
                }
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
router.post('/user', function(req, res) {
    console.log("calling post method");
    var user = req.body;
    console.log("user=" + user);
    console.log("user email =" + user.email);
    async.series([
        function(callback) {
            // users.find({ "email": email }, function(err, data) {
            users.findOne({ email: user.email }, function(error, existinguser) {
                // console.log("data=" + data);
                if (existinguser == null) {

                    callback();
                } else {
                    callback("already existing email id");
                }

            })
        },
        function(callback) {
            var user1 = new users({ "email": req.body.email, "userName": req.body.userName, "country": req.body.country, "address": req.body.address, "profession": req.body.profession });
            console.log("user1=" + user1);
            //creating new user data
            users.create(user1, function(err, data) {
                if (!data) {
                    console.log("error in posting data");
                    callback("data not added");
                } else {
                    // res.json(data);
                    callback(null, data);
                }
            })
        }
    ], function(error, done) {
        if (error) {
            res.send(error);
        } else {
            res.send(done);
        }
    })
})

//put by email
router.put("/user/:email", function(req, res) {
    var email = req.params.email;
    console.log("email=" + email);
    async.series([
        function(callback) {
            users.findOne({ email: req.params.email }, function(err, existinguser) {
                if (existinguser == null) {
                    //res.send("email id not exist");
                    callback("email id not exist")
                } else {
                    callback();
                }
            })
        },
        function(callback) {
            users.updateOne({ email: req.params.email }, { $set: { "userName": req.body.userName, "country": req.body.country, "address": req.body.address, "profession": req.body.profession } }, function(error, data) {
                if (!data) {
                    console.log("not updated");
                    callback("not updated");
                } else {
                    callback("data inserted");
                }
            })

        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })

})

//delete
// Delete - user/:email -
router.delete('/user/:email', function(req, res) {
    let email = req.params.email;
    console.log("email=" + email);
    async.series([
        function(callback) {
            users.remove({ email: req.params.email }, function(error, data) {
                if (error) {
                    //console.log(error);
                    callback(error);
                    return;
                } else {
                    callback(null, data);
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })

})

var server = app.listen(8058, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})