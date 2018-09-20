var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema

    email: {
        type: String,
        unique: true,
    },
    userInfo: {
        userName: String,
        address: String
    },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });

// var validateEmail = function(email) {
//     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return re.test(email)
// };

module.exports = mongoose.model("users", Schema);


/*

email:"abc@text.com"
userInfo:{
userName:text
address:text
},
status: text , // accepted values are activated,deactivated, deleted

*/