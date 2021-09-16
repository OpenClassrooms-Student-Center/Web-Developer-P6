const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
	imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    heat: { type: Number, required: true },
    like: { type: Number, required: false, default: 0},
    dislike: { type: Number, required: false, default: 0 },
    usersLiked: { type: Array, required: false, default: [] },
    usersDisliked: { type: Array, required: false, default: [] },
});

module.exports = mongoose.model('sauce', sauceSchema);