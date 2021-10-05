const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");
const User = require("../models/User");

require('dotenv').config()
const tokenSecret = process.env.TOKEN_SECRET;

exports.signup = (req, res, next) => {
	let passwordValidator = new RegExp("(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
	if (validator.validate(req.body.email) === false) {
		return res.status(401).json({ message: "Veuillez saisir un email valide !" });
	}
	if (passwordValidator.test(req.body.password) === false) {
		return res.status(401).json({ message: "Veuillez saisir un mot de passe plus complexe avec 8 caractères et un chiffre minimum" });
	}
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id },tokenSecret, { expiresIn: "24h" }),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
