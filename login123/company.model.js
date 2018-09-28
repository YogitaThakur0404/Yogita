var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema({ //created schema
    companyName: { type: String, validate: /[a-z]/ },
    companyInfo: { RegistartionNo: Number },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });


module.exports = mongoose.model("company", Schema);

/* companyName , companyInfo , status

db.company.insert({"companyName":"TCS","companyInfo":{"RegistartionNo":1234},"status":"activated"})
*/