var mongoose = require("mongoose");
var Schema = new mongoose.Schema({ //created schema
    companyName: String,
    address: String,
    country: String,
    state: String,
    city: String,
    status: String,
});

module.exports = mongoose.model("companys", Schema);

/*


db.companys.insert({
    companyName:"TC",
    address:"phase3",
    country:"india",
    state:"MH",
    city:"pune",
    status:"activated"
})
*/
// db.companys.insert(
//     {
//         companyName : "croma",
//         address : "phase1",
//         country : "india",
//         state: "MH",
//         city: "pune",
//         status: "deactivated"
//     }
// )*/