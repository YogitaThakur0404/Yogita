var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema({ //created schema
    companyName: { type: String, validate: /[a-z]/ },
    companyInfo: { RegistartionNo: { type: Number, unique: "true" } },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });


module.exports = mongoose.model("companys", Schema);