const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	}).then((sauce) => {
		if (sauce.userId !== req.userId) {
			return res.status(403).json({ message: "unauthorized request"});
		}
        next()
	})
	.catch((error) => {
		res.status(404).json({
			error: error,
		});
	});
};
