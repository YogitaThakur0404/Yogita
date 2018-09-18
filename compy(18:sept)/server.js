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

var companys = require("./company.model")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/companydb"); //company database


// 1.This responds a GET request for the /show page for all companys.
app.get("/show", function(req, res) {
    console.log("get all users");
    companys.find({}, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})

// 2. This responds a GET request for the status
// Get all comapnies having `status:activated` from DB

app.get("/all", function(req, res) {

    async.series([
        function(callback) {

            companys.find({ "status": "activated" }, function(err, data) {
                if (!data) {
                    // res.send("error : user not exist ");
                    callback("company not found");
                } else {
                    // console.log("company=" + data);
                    console.log("nm=" + data.companyName);
                    // res.json(data);
                    callback(null, data);

                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            console.log("nm=" + data.companyName);
            res.send(data);
        }
    });
})

// 3 This responds a GET request for the companyName
// GET by companyName,
// 1. companyName - Consider as req params in the endpoint
// 2. Get company detail having `status:activated` and `companyName` provided in req params
// 3. If company not found in DB display error-Company Not found

app.get("/all/:companyName", function(req, res) {
        async.series([
            function(callback) {
                //   companys.findOne({ "companyName": req.params.companyName }, function(err, data) {
                companys.findOne({ $and: [{ "status": "activated" }, { companyName: req.params.companyName }] }, function(error, data) {
                    if (!data) {

                        callback("company not found");
                    } else {
                        console.log("company=" + data.companyName);
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
        });
    })
    //4 get
    /*
    GET by companyName and state
1. companyName - Consider as req params
2. state - Consider as req query
2. Get company detail having `status:activated` and `companyName` provided in req params and `state` provided in req query
3. If company not found in DB display error-Company Not found
    */
app.get("/company/:companyName", function(req, res) {
        console.log("get single user by query");
        async.series([
            function(callback) {
                companys.find({ $and: [{ "status": "activated" }, { companyName: req.params.companyName }, { state: req.query.state }] }, function(error, data) {
                    console.log("data=" + data);
                    if (error) {
                        console.log(error);
                        callback("Company Not found");
                    } else if (data.length > 0) {
                        callback(null, data);
                    } else {
                        callback("Company Not found");
                    }
                })
            },
        ], function(error, Data) {
            if (error) {
                res.send(error);
            } else {
                console.log("comapny data=" + Data);
                res.send(Data);
            }
        })
    })
    /*
    POST -
1. Create new company
2. Check company already exist with `companyName` and `status:activated`
3. If company exist display error- company already exist
4. Else create new company
    */
    // 4 This responds a POST request 
app.post("/company", function(req, res) {
        var cmp = req.body;
        async.series([
            function(callback) {
                companys.find({ $and: [{ companyName: cmp.companyName }, { status: "activated" }] }, function(error, existingcmp) {
                    if (existingcmp == null) {
                        companys.create(req.body, function(error, data) {
                            if (error) {
                                console.log("error in posting data");
                                callback("data not added");
                            } else {
                                callback(null, data);
                            }
                        })
                    } else {
                        callback("error- company already exist ");
                    }
                })
            },
        ], function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        });
    })
    //5 This responds a PUT request 
    /*
PUT - by companyName
1. update company : Consider companyName as req prams
2. Check company exist or not with `companyName` and `status:activated`
3. If company exist - update company with new data
4. Else throw error- company does not exist
    */

app.put("/company/:companyName", function(req, res) {

    async.series([
        function(callback) {
            // companys.findOne({ companyName: req.params.companyName }, function(err, existinguser) {
            companys.find({ $and: [{ companyName: req.params.companyName }, { status: "activated" }] }, function(error, existingcmp) {
                if (existingcmp != null) {
                    companys.updateOne({ companyName: req.params.companyName }, { $set: { address: req.body.address, country: req.body.country, state: req.body.state, city: req.body.city, status: req.body.status } }, function(err, data) { //updating by updateOne()

                        if (!data) {
                            console.log("not updated");
                            callback("not updated");
                        } else {
                            callback(null, data);
                        }
                    })
                } else {
                    callback(" error- company does not exist");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})

//    PUT - by state
//    1. Consider state as req query
//    2. update company with `status: deactivated` having `status:activated` and `state` from req query
//    3. If companies exist with above queries - update company with new data
//    4. Else throw error- company does not exist

app.put("/company", function(req, res) {
        var state = req.query.state;
        console.log("state=" + state);
        async.series([
            function(callback) {
                companys.findOne({ state: req.query.state }, function(err, existinguser) {
                    if (existinguser != null) {
                        companys.updateMany({ state: req.query.state }, { $set: { status: req.body.status } }, function(err, data) { //updating by updateOne()

                            if (!data) {
                                console.log("not updated");
                                callback("not updated");
                            } else {
                                callback(null, data);
                            }
                        })
                    } else {
                        callback(" error- company does not exist");
                    }
                })
            },
        ], function(error, data) {
            if (error) {
                res.send(error);
            } else {
                res.send(data);
            }
        });
    })
    /*
DELETE by comapnyName
1. delete company: Consider companyName as req prams
2. Check company exist or not with `companyName` and `status:activated`
3. If company exist - update status as deleted
4. Else throw error- company does not exist
use `mongoose` module for DB related queries
    */
    // 6 This responds a DELETE request for the /users page by email . 
app.delete("/company/:companyName", function(req, res) {
    var name = req.params.companyName;
    console.log("companyName=" + name);
    async.series([
        function(callback) {
            companys.findOne({ companyName: req.params.companyName }, function(err, existinguser) {
                if (existinguser != null) {
                    companys.remove({ companyName: req.params.companyName }, function(error, data) { //remove()
                        if (!data) {
                            console.log("not deleted");
                            callback(" error- company does not exist");
                        } else {
                            callback("deleted successfully");
                        }
                    })
                } else {
                    callback(" error- company does not exist");
                }
            })
        },
    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
})
var server = app.listen(8058, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})