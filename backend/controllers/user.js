const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = require("../models/user")
const passwordSchema = require("../models/password")
require("dotenv").config()


// Création d'utilisateur avec mot de passe hashé (bcrypt)
exports.signup = (req,res) => {
    console.log(passwordSchema.validate(req.body.password));
    if (passwordSchema.validate(req.body.password) === false) {
        return res.status(401).json({ error: "Le mot de passe doit contenir au minimum 8 caractères, une majuscule, et un chiffre" })
    } else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new userSchema({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: "utilisateur créé !" }))
                .catch(err => res.status(400).json({ error: err }))
        })
        .catch(err => res.status(500).json({ error: err }))
    } 
}

// Connexion d'utilisateur et bcrypt.compare avec le mot de passe présent dans la requête et celui présent dans la base de donnée
exports.login = (req, res) => {
    userSchema.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Utilisateur non trouvé ! " })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(

                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

