var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Schema = new mongoose.Schema({ //created schema
    companyName: { type: String, unique: "true", validate: /[a-z]/ },
    companyInfo: { RegistartionNo: Number },
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });


module.exports = mongoose.model("companys", Schema);

/* companyName , companyInfo , status
db.companys.insert(
{
  
    "companyName" : "Dell",
    "companyInfo" : {
        "RegistartionNo" : 75234
    },
    "status" : "activated"
}
)
 */