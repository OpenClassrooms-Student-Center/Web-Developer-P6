const mongoose = require('mongoose'); //upload mongoose

//Define mongoose schema based on requirements of project
const saucesSchema = mongoose.Schema({
    userId:{ type: String ,required: true},
    name: {type: String, require: true},
    manufacturer: { type: String, require :true},
    description: { type: String, require: true},
    mainPepper: { type: String, require: true},
    imageUrl: {type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 },
    usersLiked: { type: Array, required: false },
    usersDisliked: {type: Array, required: false },
})

module.exports = mongoose.model('sauces', saucesSchema); //export modl to interaction with app