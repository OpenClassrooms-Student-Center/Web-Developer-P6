/*const mongoose = require("mongoose")
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    })
)
module.exports = User*/
const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const mongooseSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    })
uniqueValidator.defaults.message = "this email is already used"
mongooseSchema.plugin(uniqueValidator)
const User = mongoose.model("User", mongooseSchema)
module.exports = User