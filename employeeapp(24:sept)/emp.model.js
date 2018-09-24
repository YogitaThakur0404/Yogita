var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
var Schema = new mongoose.Schema({ //created schema

    empName: String,
    empAddress: String,
    country: String,
    state: String,
    department: String,
    status: { type: String, enum: ['activated', 'deactivated', 'deleted'] }

}, { versionKey: false });

Schema.plugin(mongoosePaginate);
module.exports = mongoose.model("employees", Schema);

//Employee fields - empName, empAddress, country, state, department,status
