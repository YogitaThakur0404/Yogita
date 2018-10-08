var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema

    firstName: { type: String, validate: /[a-z]/ },
    lastName: { type: String, validate: /[a-z]/ },
    email: { type: String, unique: "true", validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    studentInfo: {
        address: String,
        city: String
    },
    class: { type: String, enum: ['FE', 'SE', 'TE', 'BE'] },
    password: { type: String, minlength: 8, maxlength: 12 },
    status: { type: String, enum: ['pass', 'fail'] }

}, { versionKey: false });
module.exports = mongoose.model("students", Schema);

/*
db.students.insert({"firstName":"Hemant","lastName":"Thakur","email":"h@gmail.com","studentInfo":{"address":"n4","city":"aurangabad"},"class":"BE","password":"123456789","status":"pass"})

*/