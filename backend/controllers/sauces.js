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
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet modifié !" }))
		.catch((error) => res.status(400).json({ error }));
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

exports.likeSauces = (req, res, next) => {
	console.log(req.params.id);
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauceRate) => {
			if (req.body.like === 0) {
				sauceRate.usersLiked.unset(req.body.userId);
				console.log(sauceRate.usersLiked);
			} else {
				if (req.body.like === 1) {
					sauceRate.usersLiked.push(req.body.userId);
					const like = sauceRate.usersLiked.length;
					sauceRate.like = like;
					console.log(req.params.id);
				} else {
					sauceRate.usersDisliked.push(req.body.userId);
					console.log(sauceRate);
				}
			}
			Sauce.updateOne({ _id: req.params.id }, { sauceRate, _id: req.params.id })
				.then(() => res.status(200).json({ message: "Objet modifié !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};
