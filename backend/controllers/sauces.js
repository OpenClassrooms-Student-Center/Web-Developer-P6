const Sauce = require("../models/sauce");
const fs = require("fs");

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
	let sauceObject;
	function sauceUpdate() {
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
			.then(() => res.status(200).json({ message: "Sauce Modified !" }))
			.catch((error) => res.status(400).json({ error }));
	}
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split("/images/")[1];
				console.log(filename);
				fs.unlink(`images/${filename}`, () => {});

				sauceObject = {
					...JSON.parse(req.body.sauce),
					imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
				};
				sauceUpdate();
			})
			.catch((error) => res.status(500).json({ error }));
	} else {
		sauceObject = { ...req.body };
		sauceUpdate();
	}
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce Deleted !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
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
	Sauce.findOne({
		_id: req.params.id,
	})
		.then((sauce) => {
			if (req.body.like === 0) {
				const index = sauce.usersLiked.indexOf(req.body.userId);
				console.log(index);
				if (index >= 0) {
					sauce.usersLiked.splice(index, 1);
				}
				const indexD = sauce.usersDisliked.indexOf(req.body.userId);
				if (indexD >= 0) {
					sauce.usersDisliked.splice(indexD, 1);
				}
			} else {
				const usersRated = sauce.usersLiked.concat(sauce.usersDisliked);
				usersRated.forEach((el) => {
					if (req.body.userId === el) {
						throw "403: User already Rate";
					}
				});
				if (req.body.like === 1) {
					sauce.usersLiked.push(req.body.userId);
				} else {
					sauce.usersDisliked.push(req.body.userId);
				}
			}
			const like = sauce.usersLiked.length;
			const dislike = sauce.usersDisliked.length;
			sauce.likes = like;
			sauce.dislikes = dislike;
			Sauce.updateOne({ _id: req.params.id }, sauce)
				.then(() => res.status(200).json({ message: "Rated !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => {
			res.status(403).json({
				error: error,
			});
		});
};
