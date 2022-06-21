const config = require("../config/auth.config")
const db = require("../models")
const User = db.user
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')

//password hash
exports.signup = (req, res) => {
    console.log(req.body)
    const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    
    user.save((err, user) => {
        if (err) { 
             return res.status(500).send({ message:"Erreur lors de l'enregistrement de l'utilisateur" }) 
        }
        res.status(200).send({ message: err })
    })
}

//signin
exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (!user) {
            res.status(404).send({ message: err })
            return
        }
        let passwordChecker = bcrypt.compareSync(
            req.body.password,
            user.password
        )
        if (!passwordChecker) {
            res.status(401).send({
                token: null,
                message: err
            })
            return
        }
        let token = jwt.sign({ id: user._id }, config.SECRET, {
            expiresIn: 86400
        })
        res.status(200).send({
            userId: user._id,
            email: user.email,
            token: token
        })
    })
}