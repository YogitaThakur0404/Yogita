var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var fs = require("fs");
app.use(express.json());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var query = require('querystring');
app.use(express.static('public'));
var assert = require('assert');
app.use(cookieParser());
app.use(session({ secret: "Your secret key", cookie: { maxAge: 3600000 }, saveUninitialized: true, resave: true }));

var async = require('async');

var products = require("./product.model")

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/productdb"); //product database

app.use(express.static(__dirname + "/angular"));

//get all with map
app.get("/product", function(req, res) {
    products.find()
        .select("productName price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => { //map
                    return {
                        productName: doc.productName,
                        price: doc.price,
                        _id: doc._id,

                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

})

//get by brand
app.get("/product/:brand", function(req, res) {
    var brand = req.params.brand;
    async.series([
        function(callback) {
            products.aggregate(
                [{ $match: { brand: brand } },
                    { $project: { productName: { $toUpper: "$productName" }, _id: 0, state: 1 } },
                    { $sort: { productName: 1 } }
                ],
                function(error, data) {
                    console.log("data=" + data.length);
                    if (data.length > 0) {
                        callback(null, data);
                    } else if (data.length <= 0) {
                        callback("no such brand available ");
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

//by rating
app.get("/product1/:rating", function(req, res) {
    var rating = req.params.rating;
    async.series([
        function(callback) {
            products.find({ rating: rating }, function(error, data) {
                if (data.length > 0) {
                    callback(null, data);
                } else if (error) {
                    callback("please insert valid input");

                } else {
                    callback("no product found");
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

app.post("/product", function(req, res) {
        var prod = req.body;
        console.log("prod" + prod);
        async.series([
            function(callback) {
                products.find({ productId: req.body.productId }, function(error, data) {
                    if (data.length > 0) {
                        res.send("productId already exist ....try another value");
                    } else if (data.length == 0) {
                        products.create(req.body, function(err, data) {
                            if (!data) {
                                console.log("error in posting data");
                                callback("data not added");
                            } else {
                                callback(null, data);
                            }
                        })
                    } else {
                        res.send("please enter valid data");
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
    //put

app.put("/product/:productId", function(req, res) {
        console.log("prodid" + req.params.productId);
        async.series([
            function(callback) {
                products.find({ productId: req.params.productId }, function(error, data) {
                    console.log("data=" + data);
                    if (data.length > 0) {
                        products.updateOne({ productId: req.params.productId }, { $set: { qty: req.body.qty } }, function(err, data) {
                            if (!data) {
                                console.log("error in posting data");
                                callback("data not added");
                            } else {
                                callback(null, data);
                            }
                        })
                    } else {
                        callback("please enter valid data");
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
    //with map and reduce 
app.get("/product123/allbrand", function(req, res) {
    console.log("all brand");
    var o = {};
    o.map = function() {
        console.log("in mapper");
        var brands = this.brand.split(',');
        for (i in brands) {
            emit(brands[i], 1);
        }
    };
    o.reduce = function(key, values) {
        var count = 0;
        for (index in values) {
            count += values[index];
        }
        return count;
    };
    products.mapReduce(o, function(err, data, stats) {
        // console.log('map reduce took %d ms', stats.processtime)
        if (err) res.send(err);
        else res.send(data);
    })
})

//get by using cursor
app.get("/product11", function(req, res) {
        const cursor = products.find({ "qty": { $gt: 2000 } }).cursor();
        //Print the first document.
        cursor.eachAsync(data => { //return only one record 
            console.log("data=" + data)
            if (data.length > 0) {
                console.log("data=" + data);
                res.send(data)
            } else {
                res.send("no data found")
            }
        })
    })
    //different operators
app.get("/productmatch/:productName", function(req, res) {
    var name = req.params.productName;
    console.log("name=" + name);
    async.series([
        function(callback) {
            //$text:
            // products.find({ $text: { $search: name } }, function(error, data) {
            //     console.log(data);
            //     res.send(data);
            // })

            //$elematch:
            products.aggregate([{ $match: { brand: name } }, { $sort: { qty: 1 } }], function(error, data) {
                console.log(data);
                if (data.length > 0) {
                    callback(null, data);
                } else {
                    callback("data not found")
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

app.use(function(req, res) {
    res.sendStatus(404);
})
var server = app.listen(8050, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})