const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true }
});
// UniqueValidator ensures that one email is unique to one user
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);