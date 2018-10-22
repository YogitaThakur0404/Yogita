var methods = {};


//create user data
methods.insertData = function(req, res, next) {
    var user1 = new users({ firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password, email: req.body.email, "userInfo.city": req.body.userInfo.city, "userInfo.address": req.body.userInfo.address, "status": "activated" });
    //creating new user data
    users.create(user1, function(err, data) {
        if (!data) {
            console.log("error in posting data" + data);
            res.send("data not added");
        } else {
            res.send("data inserted");
            next();
        }
    })
}

module.exports = methods;