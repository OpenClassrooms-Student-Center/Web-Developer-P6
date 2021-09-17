const Sauce = require("../models/sauce");

module.exports = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	}).then((sauce) => {
		const usersRated = sauce.usersLiked.concat(sauce.usersdisLiked);
		console.log(usersRated);
		usersRated.forEach((el) => {
			if (req.body.userId === el) {
                throw "403: User already Rate";
			}
		});
		next();
	});
	// .catch((error) => {
	// 	res.status(404).json({
	// 		error: error,
	// 	});
	// });
};
