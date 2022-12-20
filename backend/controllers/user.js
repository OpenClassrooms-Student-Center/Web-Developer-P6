const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const userSchema = require("../models/user")


exports.signup = (req,res) => {
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

exports.login = (req,res) => {
    userSchema.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (valid) {
                            res.status(200).json({ userId: user._id, token: jsonwebtoken.sign(
                                { userId: user._id },
                                "RANDOM_TOKEN_SECRET",
                                { expiresIn: "24h" }
                            ) })
                        } else {
                            res.status(401).json({ message: "Identifiant ou mot de passe incorrect." })
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            } else {
                res.status(401).json({ message: "Identifiant ou mot de passe incorrect."})
            }
        })
        .catch(error => res.status(500).json({ error }))
}