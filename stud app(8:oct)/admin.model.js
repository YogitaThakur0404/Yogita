var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema

    firstName: { type: String, validate: /[a-z]/ },
    lastName: { type: String, validate: /[a-z]/ },
    email: { type: String, unique: "true", validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password: { type: String, minlength: 8, maxlength: 12 }
}, { versionKey: false });
module.exports = mongoose.model("admindata", Schema);

/*
db.admin.insert({"firstName":"pvc","lastName":"patil","email":"pvc@gmail.com","password":"1234567890"});
*/