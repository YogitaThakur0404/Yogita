var express = require('express');
var app = express();
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
var companys = require("./company.model")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/userdbs"); //company database


// 1.This responds a GET request for the / page.
app.get("/", function(req, res) {
    res.end("get method calling");
})

//GET user - get all  users
app.get("/show", function(req, res) {
    console.log("get all users");
    users.find({}, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})


// //autocomplete
// app.get("/user/:search", cors(), function(req, res) {

//     autocomplete.query(req.params.name, req.query.term, function(err, data) {
//         if (err) {
//             return res.send([]);
//         }
//         res.send(data);
//     });
// });


// //POST -user  -  check whether user email exist if exist throw , else insert the data , return the data inserted
// email should be unique entry in DB , we should not allow any direct DB entries for any kind of duplicated
// email:"abc@text.com" //should regex check the pattern such that it allows only `_ and @ only as special characters`


app.post("/users", function(req, res) {
    var user = req.body;
    console.log("user=" + user);
    console.log("user email =" + user.email);

    users.findOne({ email: user.email }, function(err, existinguser) {
        if (existinguser == null) {
            console.log("email=" + req.body.email);

            var email = function ValidateEmail(mail) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
                    var user1 = new users({ email: req.body.email, "userInfo.userName": req.body.userInfo.userName, "userInfo.address": req.body.userInfo.address, "status": "activated" });
                    console.log("user1=" + user1);

                    users.create(user1, function(err, data) {
                        if (!data) {
                            console.log("error in posting data");
                            res.send("data not added");
                        } else {
                            res.json(data);
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

//PUT - user/:id - update by _id of mongo Document  , return the data inserted
//should not allow a different email to be updated via the request body

app.put("/users/:_id", function(req, res) {
    var id1 = req.params._id;
    console.log("id1=" + id1);
    users.findOne({ _id: req.params._id }, function(err, existinguser) {
        if (existinguser == null) {
            res.send("id not exist");
        } else {
            users.updateOne({ _id: req.params._id }, { $set: { 'userInfo.userName': req.body.userInfo.userName, 'userInfo.address': req.body.userInfo.address } }, function(err, data) {
                if (data.leng) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send("updated successfully");
                }
            })

        }
    })

})

//PUT - user/:email update by email  , return the data inserted
//should not allow a different email to be updated via the request body

app.put("/user/:email", function(req, res) {
    var email = req.params.email;
    console.log("id1=" + email);
    users.findOne({ email: req.params.email }, function(err, existinguser) {
        if (existinguser == null) {
            res.send("email id not exist");
        } else {
            users.updateOne({ email: req.params.email }, { $set: { 'userInfo.userName': req.body.userInfo.userName, 'userInfo.address': req.body.userInfo.address } }, function(err, data) {
                if (data.leng) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send("data inserted successfully");
                }
            })

        }
    })

})

//PUT - user/:id - _id or email
//change status from activated to deactivated





app.put("/user1/:_id?/:email?", function(req, res) {
    console.log("id=" + req.params._id);
    console.log("email=" + req.params.email);

    if (req.params.email != null) {
        users.find({ $and: [{ email: req.params.email }, { status: "activated" }] }, function(err, existinguser) {
            console.log("existing user=" + existinguser.length);
            if (existinguser.length > 0) {
                users.updateOne({ email: req.params.email }, { $set: { status: "deactivated" } }, function(err, data) {
                    if (data.length <= 0) {
                        console.log("not updated");
                        res.send("not updated");
                    } else {
                        res.send("data inserted successfully");
                    }
                })

            } else {
                res.send("email id not exist");
            }
        })
    } else if (req.params._id != undefined) {
        users.find({ $and: [{ _id: req.params._id }, { status: "activated" }] }, function(err, existinguser) {
            //users.findOne({ _id: req.params._id }, function(err, existinguser) {
            console.log("existing user=" + existinguser.length);
            if (existinguser.length > 0) {
                users.updateOne({ _id: req.params._id }, { $set: { status: "deactivated" } }, function(err, data) {
                    if (data.length <= 0) {
                        console.log("not updated");
                        res.send("not updated");
                    } else {
                        res.send("updated successfully");
                    }
                })

            } else {
                res.send("id not exist");
            }
        })

    } else {
        res.send("invalid credentials");
    }

})

// app.put("/user1/:id", function(req, res) {
//     var id = req.params.id;
//     console.log("id=" + req.params.id);


//     if (id != null) {
//         // users.find({ $and: [{ $or: [{ email: req.params.id }, { _id: req.params.id }] }, { status: "activated" }] }, function(err, existinguser) {
//         users.findOne({ $or: [{ email: req.params.id }, { _id: req.params.id }] }, function(error, existinguser) {

//             console.log("existing user=" + existinguser);
//             // console.log("existing user=" + email);
//             // console.log("existing user=" + id);

//             if (existinguser != null) {
//                 users.updateOne({ email: req.params.id }, { $set: { status: "deactivated" } }, function(err, data) {
//                     if (data.length <= 0) {
//                         console.log("not updated");
//                         res.send("not updated");
//                     } else {
//                         res.send("data inserted successfully");
//                     }
//                 })
//             } else {
//                 res.send("email id not exist");
//             }
//         })
//     }
//     // else if (req.params._id != undefined) {
//     //     users.find({ $and: [{ _id: req.params._id }, { status: "activated" }] }, function(err, existinguser) {
//     //         //users.findOne({ _id: req.params._id }, function(err, existinguser) {
//     //         console.log("existing user=" + existinguser.length);
//     //         if (existinguser.length > 0) {
//     //             users.updateOne({ _id: req.params._id }, { $set: { status: "deactivated" } }, function(err, data) {
//     //                 if (data.length <= 0) {
//     //                     console.log("not updated");
//     //                     res.send("not updated");
//     //                 } else {
//     //                     res.send("updated successfully");
//     //                 }
//     //             })

//     //         } else {
//     //             res.send("id not exist");
//     //         }
//     //     })

//     // } 
//     else {
//         res.send("invalid credentials");
//     }

// })




// /Delete - user/:Id - delete by _id or email -
// change status to deleted


////////    company
//GET - company/ - list of all activated companies



//GET user - get all  users
app.get("/company", function(req, res) {
    console.log("get all ");
    companys.find({}, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})

var server = app.listen(8020, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})