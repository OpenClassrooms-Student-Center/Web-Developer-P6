const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // package to control email unique validation

const userSchema = mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true}

})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('user', userSchema)