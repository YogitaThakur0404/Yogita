var methods = {};

//validate email
methods.ValidateEmail = function(req, res, next) {
    console.log("valid emil call");
    async.series([
        function(callback) {
            if (!req.session.docs) {
                return res.status(404).send();
            } else {
                users.findOne({ email: req.body.email }, function(err, existinguser) {
                    if (existinguser == null) {
                        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
                            callback(null, "true")
                            next()
                        } else {
                            callback("invalid email");
                        }
                    } else {
                        callback("email already exist please try another value")

                    }
                })
            }
        }

    ], function(error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data[1]);
        }
    })
}


module.exports = methods;