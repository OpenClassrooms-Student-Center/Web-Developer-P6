const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, required: true},
    dislikes: { type: Number, required: true},
    imageUrl: { type: String, required: false},
    mainPepper: { type: String, required: true},
    usersLiked: { type: Array, required: true},
    usersDisliked: { type: Array, required: true},
    userId: { type: String, required: true}
});

module.exports = mongoose.model('Sauce', sauceSchema);