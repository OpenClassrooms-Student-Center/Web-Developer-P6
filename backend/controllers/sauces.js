const Sauce = require("../models/sauce");

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce créée !" }))
		.catch((error) => res.status(400).json(console.log(sauce)));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			res.status(200).json(sauce);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};

exports.modifySauce = (req, res, next) => {
	const sauce = new Sauce({
		_id: req.params.id,
		userId: req.params.userId,
		name: req.body.name,
		manufacturer: req.body.manufacturer,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		mainPepper: req.body.mainPepper,
		heat: req.body.heatValue,
	});
	Sauce.updateOne({ _id: req.params.id }, sauce)
		.then(() => {
			res.status(201).json({
				message: "La sauce à été modifiée avec succès !",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.deleteSauce = (req, res, next) => {
	Sauce.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({
				message: "Sauce supprimée !",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces);
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// exports.likeSauces = (req, res, next) => {
// 	if (req.body.like === 1) {
// 		const sauce = new Sauce({
// 			_id: req.params.id,
// 			like: req.params.like + 1,
// 			usersLiked: req.params.userId,
// 		});
// 		Sauce.updateOne({ _id: req.params.id }, sauce)
// 			.then(() => {
// 				res.status(201).json({
// 					message: "La sauce à été liké !",
// 				});
// 			})
// 			.catch((error) => {
// 				res.status(400).json({
// 					error: error,
// 				});
// 			});
// 	}
// 	const sauce = new Sauce({
// 		_id: req.params.id,
// 		dislike: req.params.dislike + 1,
// 		usersDisliked: req.params.userId,
// 	});
// 	Sauce.updateOne({ _id: req.params.id }, sauce)
// 		.then(() => {
// 			res.status(201).json({
// 				message: "La sauce à été disliké !",
// 			});
// 		})
// 		.catch((error) => {
// 			res.status(400).json({
// 				error: error,
// 			});
// 		});
// };
