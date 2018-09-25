var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema


    userName: {
        type: String,
        required: true,
        maxLength: 20,
        minLength: 3
    },
    address: String,
    country: String,
    email: {
        type: String,
        unique: true,
        match: /\S+@\S+\.\S+/,
        required: true
    },
    profession: String
}, { versionKey: false });

// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };
//db.users.insert("userName":"Hemant","address":"n4","country":"India","email":"hemant@gmail.com","profession":"builder")
module.exports = mongoose.model("users", Schema);