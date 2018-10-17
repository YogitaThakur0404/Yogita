var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema
    productId: { type: String, required: true, validate: /[a-z]/, unique: true },
    productName: { type: String, validate: /[a-z]/ },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number },
    status: { type: String, enum: ['available', 'outofstock'] }

}, { versionKey: false });
module.exports = mongoose.model("products", Schema);
/*
db.products.insert({"productName":"body lotion","qty":100,"price":250,"brand":"nivea","rating":5,"status":"available"})
*/