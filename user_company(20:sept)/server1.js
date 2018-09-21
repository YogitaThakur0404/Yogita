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

//GET user/:searchPattern - a autocomplete  api , 
//should match all the userName with the pattern starting with the :searchPattern parameter
app.get('/user/:searchPattern', function(req, res) {
    let searchPattern = req.params.searchPattern;
    users.find({ 'userInfo.userName': { '$regex': searchPattern, '$options': 'i' } }, function(err, data) {
        if (!data) {
            console.log("error in posting data");
            res.send("data not added");
        } else {
            res.json(data);
        }
    });

})

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
app.put("/users/:id", function(req, res) {
    var id1 = req.params.id;
    console.log("id1=" + id1);
    users.findOne({ _id: req.params.id }, function(err, existinguser) {
        if (existinguser == null) {
            res.send("id not exist");
        } else {
            users.updateOne({ _id: req.params.id }, { $set: { 'userInfo.userName': req.body.userInfo.userName, 'userInfo.address': req.body.userInfo.address } }, function(err, data) {
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send(data);
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

// // PUT - user/:id - _id or email
// // change status from activated to deactivated
// app.put("/user1/:id", function(req, res) {
//     var id = req.params.id;
//     //var id1 = mongoose.Types.ObjectId(req.params.id);
//     // console.log("id1=" + id1);
//     if (id != null) {
//         console.log("id=" + id);
//         // users.find({ $and: [{ $or: [{ email: req.params.id }, { _id: req.params.id }] }, { status: "activated" }] }, function(err, existinguser) {
//         // users.find({ $or: [{ email: req.params.id }, { _id: req.params.id }] }, function(error, existinguser) {
//         //users.findOne({ and: [{ $or: [{ 'email': id }, { '_id': id }] }, { status: { "$ne": 'deleted' } }] }, function(error, existinguser) {
//         //  console.log("existing user=" + existinguser.email);
//         //   console.log("existing user=" + existinguser._id);
//         //  users.find({ $and: [{ $or: [{ email: req.params.id }, { _id: req.params.id }, { status: "activated" }] }] }, function(err, existinguser) {
//         var mg = req.params.id;
//         try {
//             mg = mongoose.Types.ObjectId(req.params.id)
//         } catch (error) {

//         }
//         users.find({ $or: [{ "email": req.params.id }, { "_id": mg }] }, function(error, existinguser) {
//                 console.log("existing user=" + existinguser);
//                 if (existinguser.email == req.params.id) {
//                     users.update({ email: req.params.id }, { $set: { status: "deactivated" } }, function(err, data) {
//                         if (data.length <= 0) {
//                             console.log("not updated");
//                             res.send("not updated");
//                         } else {
//                             res.send("data updated successfully");
//                         }
//                     })
//                 }
//                 if (existinguser._id == mongoose.Types.ObjectId(req.params.id)) {

//                     users.update({ _id: mongoose.Types.ObjectId(req.params._id) }, { $set: { status: "deactivated" } }, function(err, data) {
//                         if (data.length <= 0) {
//                             console.log("not updated");
//                             res.send("not updated");
//                         } else {
//                             res.send("data updated successfully");
//                         }
//                     })
//                 } else {
//                     res.send("data  id not exist");
//                 }
//             })
//             // } else {
//             //     res.send("invalid credentials");
//     }
// })

// app.put("/user12/:id", function(req, res) {
//         var id = req.params.id;
//         var id1 = mongoose.Types.ObjectId(req.params.id);
//         console.log("id1=" + id1);

//         if (id != null) {
//             users.find({}, function(error, existinguser) {

//                 if (existinguser.length > 0) {
//                     users.update({ email: req.params.id }, { $set: { status: "deactivated" } }, function(err, data) {
//                         if (data.length <= 0) {
//                             console.log("not updated");
//                             res.send("not updated");
//                         } else {
//                             res.send("data updated successfully");
//                         }
//                     })
//                 } else {
//                     res.send("invalid");
//                 }
//             })
//         }
//     })


// PUT - user/:id - _id or email
// change status from activated from  deactivated
app.put('/user/:id', function(req, res) {
    let id = req.params.id;

    users.find({ $or: [{ 'email': id }, { '_id': id }] }, function(error, data) {
        console.log(data);
        if (data.length > 0) {
            users.update({ $or: [{ 'email': id }, { '_id': id }] }, { '$set': { 'status': "deactivated" } },
                function(error) {
                    if (error) {
                        console.log(error);
                        return;
                    } else {
                        res.send('updated ');
                    }
                })
        } else {
            res.send('Data not found to Update');
        }
    })

})

//delete
// Delete - user/:Id - delete by _id or email -
// change status to deleted
app.delete('/user/:id', function(req, res) {
    let id = req.params.id;

    users.find({ $or: [{ 'email': id }, { '_id': id }] }, function(error, data) {
        console.log(data);
        if (data.length > 0) {
            users.update({ $or: [{ 'email': id }, { '_id': id }] }, { '$set': { 'status': "deleted" } },
                function(error) {
                    if (error) {
                        console.log(error);
                        return;
                    } else {
                        res.send('updated ');
                    }
                })
        } else {
            res.send('Data not found to Update');
        }
    })

})



//company

// //show all
// app.get("/companyss", function(req, res) {
//     console.log("get all ");
//     companys.find({}, function(err, data) {
//         if (!data) {
//             res.send("error");
//         } else {
//             console.log("company=" + data);
//             res.json(data);
//         }
//     })
// })

//GET - company/ - list of all activated companies
app.get("/company", function(req, res) {
    console.log("get all ");
    companys.find({ status: "activated" }, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("company=" + data);
            res.json(data);
        }
    })
})

//GET - company/:companyName - get list of different companyName - get by query use any aggregate query
app.get("/company/:companyName", function(req, res) {
    var id = req.params.companyName;
    console.log("id=" + id);
    if (id === 'companyName') {
        companys.distinct(("companyName"), function(error, data) {
            if (data.length > 0) {
                console.log("ctry=" + data);
                res.send(data);
            } else {
                res.send("invalid");
            }
        })

    } else {
        res.send("invalid")
    }
})

//POST
// POST - company/
// check whether email as supplied in post body exists in user collection else throw error
app.post("/company", function(req, res) {
    var company1 = req.body;
    var email = req.body.companyInfo.userInfo.userEmail[0];
    console.log("company1=" + company1);
    console.log("email=" + email);
    users.find({ "email": email }, function(err, data) {
        console.log("doc=" + data);
        if (data.length > 0) {
            console.log("create cmp data");
            var cmp1 = new companys({ "companyInfo.userInfo.userEmail": email, "companyInfo.fax": req.body.companyInfo.fax, "companyInfo.RegistartionNo": req.body.companyInfo.RegistartionNo, "companyName": req.body.companyName, "status": req.body.status });
            console.log("cmp1=" + cmp1);
            companys.create(cmp1, function(err, data) {
                // companys.create({company1}, function(err, data) {
                console.log("data in save = " + data);
                console.log("cmp1 in save =" + company1);
                if (!data) {
                    console.log("error in posting data");
                    res.send("data not added");
                } else {
                    res.send(data);
                }
            })
        } else {
            res.send('User isnot exist');
        }
    })
})

// PUT - company/:id update by _id
// check whether email as supplied in post body exists in user collection else throw error
app.put("/company/:id", function(req, res) {
    var id = req.params.id;
    console.log("id=" + id);
    var company1 = req.body;
    var email = req.body.companyInfo.userInfo.userEmail[0];
    console.log("company1=" + company1);
    console.log("email=" + email);

    users.find({ "email": email }, function(err, data) {
        console.log("doc=" + data);
        if (data.length > 0) {
            companys.findOne({ _id: req.params.id }, function(err, existingcmp) {
                if (existingcmp == null) {
                    res.send("id not exist");
                } else {
                    companys.updateOne({ _id: req.params.id }, { $set: { 'companyName': req.body.companyName, 'companyInfo.fax': req.body.companyInfo.fax, 'companyInfo.RegistartionNo': req.body.companyInfo.RegistartionNo, 'status': req.body.status } }, function(err, data) {

                        if (!data) {
                            console.log("not updated");
                            res.send("not updated");
                        } else {
                            res.send("updated successfully");
                        }
                    })

                }
            })
        } else {
            res.send('User isnot exist');
        }
    })
})

//delete
// Delete - company/:Id delete by _id
// change status to deleted
app.delete("/company/:Id", function(req, res) {
    var id = req.params.Id;
    console.log("id=" + id);
    companys.findOne({ _id: req.params.Id }, function(err, existingcmp) {
        if (existingcmp != null) {
            companys.update({ _id: req.params.Id }, { $set: { status: "deleted" } }, function(error, data) { //updating by updateOne()
                if (!data) {
                    console.log("not updated");
                    res.send("not updated");
                } else {
                    res.send(data);
                }
            })
        } else {
            res.send(" error- company does not exist");
        }
    })
})


var server = app.listen(8050, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})