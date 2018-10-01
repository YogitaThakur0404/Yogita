var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema

    firstName: { type: String, validate: /[a-z]/ },
    lastName: { type: String, validate: /[a-z]/ },
    email: { type: String,unique:"true", validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    userInfo: {
        address: String,
        city: String
    },
    password: { type: String, minlength: 8, maxlength: 12 },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });
module.exports = mongoose.model("users", Schema);
/*
firstName , lastName, email ,userInfo -address and all , status 
*/

/*
db.users.insert({"firstName":"hemant",
"lastName":"Thakur",
"email":"hemant@gmail.com",
"userInfo":{
    "address":"n4",
    "city":"aurangabad"
},
"password":"123456789",
"status":"activated"});
*/