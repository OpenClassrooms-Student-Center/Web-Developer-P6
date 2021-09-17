const Sauce = require("../models/sauce");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	}).then((sauce) => {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
		const userId = decodedToken.userId;
		if (sauce.userId !== userId) {
			throw "403: unauthorized request";
		}
        next()
	})
	.catch((error) => {
		res.status(404).json({
			error: error,
		});
	});
};
