const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // package to control email unique validation

const userSchema = mongoose.Schema({
    email:{type: String, required: true, unique: true, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]}, //use regular expression to manage email validation}
    password:{type: String, required: true},
    

})

userSchema.plugin(uniqueValidator); // using plugin unique validator
module.exports = mongoose.model('user', userSchema) //export model to use app