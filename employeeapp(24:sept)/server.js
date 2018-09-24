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

var employees = require("./emp.model")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/employeedb"); //company database


//GET user - get all  users
app.get("/show", function(req, res) {
    console.log("get all users");
    employees.find({ "status": "activated" }, function(err, data) {
        if (!data) {
            res.send("error");
        } else {
            console.log("users=" + data);
            res.json(data);
        }
    })
})


//geting by pagination
/*
GET - provide page, sort query parameter
1. Get all Employee having `status:activated` from DB
2. if page parameter is provided  send 10 records per page Else send default 10 records
3. set default `sort` parameter as `asc` if no sort parameter provided in url
*/

app.get('/emp1', function(req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var sort = req.query.sort;
    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    query.sort = { "empName": sort };
    employees.find({ "status": "activated" }, {}, query, function(err, data) {
        // Mongo command to fetch all data from collection.
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "employee": data };
            res.json(response);
        }

    });
})


//POST -
//1. Add new employee with status activated
app.post("/emp", function(req, res) {
    var emp1 = req.body;
    console.log("emp=" + emp1);

    var status = req.body.status;
    console.log("status=" + status);

    if (status == "activated") {
        employees.create(emp1, function(error, data) {
            console.log("data in save = " + data);
            console.log("emp1 in save =" + emp1);
            if (!data) {
                console.log("error in posting data");
                res.send("data not added");
            } else {
                res.send(data);
            }
        })
    } else {
        res.send("status needs to be activated ");
    }

})

/*
GET  by country
1. Country: Consider as req params
2. Get list of all states having `status:activated` and `country` provided in req params group by different state
*/
app.get("/emp/:country", function(req, res) {
    console.log("get ctry");
    var ctry = req.params.country;
    console.log("ctry=" + ctry);

    employees.aggregate([{ $match: { country: ctry } },
        { $project: { state: 1 } }
    ], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
})

/*
GET  employee by department
1.department: Consider as req params
2.Get the total number of employees present under that department
*/
app.get("/emp22/:department", function(req, res) {
    console.log("get dept");
    var dept = req.params.department;
    console.log("dept=" + dept);


    employees.aggregate([{ $match: { department: dept } }, {
        $group: {
            _id: "$department", //$region is the column name in collection
            count: { $sum: 1 }
        }
    }], function(err, result) {
        console.log("result=" + result);
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
})




var server = app.listen(8015, function() {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})