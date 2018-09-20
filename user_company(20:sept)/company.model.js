var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema({ //created schema
    companyName: { type: String, validate: /[a-z]/ },
    companyInfo: {
        fax: Number,
        RegistartionNo: Number,
        userInfo: {
            userEmail: {
                type: Schema.Types.ObjectId,
                ref: 'user.model'
            }
        }
    },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });


module.exports = mongoose.model("companys", Schema);



/*
`company`

companyName: "text" // no special character
companyInfo:{
fax:Number,
RegistartionNo : Number,
userInfo:{
userEmail:["abc@text.com"]
}
status: text , // accepted values are activated,deactivated, deleted
}

*/