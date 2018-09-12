var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema
    name: String,
    email: String,
    id: Number
});

module.exports = mongoose.model("users", Schema);