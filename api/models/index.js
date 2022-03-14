//init mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.user = require("./user.model")
db.sauce = require("./sauce.model")
module.exports = db