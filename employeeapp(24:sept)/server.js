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

//agg paginate
app.get('/employee', function(req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var sort = req.query.sort;
    var pageOptions = {
        pageNo: req.query.pageNo || 0,
        size: req.query.size || 10
    }
    console.log("pageno" + pageOptions.pageNo);
    console.log("size" + pageOptions.size);
    employees.aggregate([
        { '$match': { 'status': 'activated' } },
        { '$group': { '_id': "_id", 'result': { '$push': '$$CURRENT' } } },
        { '$project': { '_id': 0, 'result': 1, 'pages': { '$divide': [{ '$size': '$result' }, pageOptions.size] } } },
        { '$unwind': '$result' },
        { '$skip': (pageOptions.pageNo - 1) * pageOptions.size },
        { '$limit': pageOptions.size }
    ], function(err, data) {
        ///employees.find({ "status": "activated" }, {}, query, function(err, data) {
        // Mongo command to fetch all data from collection.
        console.log("data=" + data);
        if (err) {
            response = { "error": true, "message": "Error fetching data" };
        } else {
            response = { "employee": data };
            res.json(response);
        }

    });
})

// //geting by pagination
// /*
// GET - provide page, sort query parameter
// 1. Get all Employee having `status:activated` from DB
// 2. if page parameter is provided  send 10 records per page Else send default 10 records
// 3. set default `sort` parameter as `asc` if no sort parameter provided in url
// */

// app.get('/allemp', function(req, res) {
//     var pageNo = parseInt(req.query.pageNo);
//     var size = parseInt(req.query.size);
//     var sort = req.query.sort;
//     var query = {}
//     if (pageNo < 0 || pageNo === 0) {
//         response = { "error": true, "message": "invalid page number, should start with 1" };
//         return res.json(response)
//     }
//     query.skip = size * (pageNo - 1)
//     query.limit = size
//     query.sort = { "empName": sort };
//     employees.find({ "status": "activated" }, {}, query, function(err, data) {
//         //employees.aggregatePaginate({ "status": "activated" }, {}, query, function(err, data) {
//         // Mongo command to fetch all data from collection.
//         if (err) {
//             response = { "error": true, "message": "Error fetching data" };
//         } else {
//             response = { "employee": data };
//             res.json(response);
//         }

//     });
// })

//POST -
//1. Add new employee with status activated
app.post("/emp", function(req, res) {
    console.log("create emp data");
    var emp = new employees({ "empName": req.body.empName, "empAddress": req.body.empAddress, "country": req.body.country, "state": req.body.state, "department": req.body.department, "status": "activated" });
    console.log("emp=" + emp);
    companys.create(emp, function(error, data) {
        console.log("data in save = " + data);
        if (!data) {
            console.log("error in posting data");
            res.send("data not added");
        } else {
            res.send(data);
        }
    })
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

    employees.aggregate([{ $match: { country: ctry } }, { $match: { status: "activated" } }, { $project: { state: 1 } }], function(err, result) {
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
app.get("/emp/:department", function(req, res) {
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


var server = app.listen(8045, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})