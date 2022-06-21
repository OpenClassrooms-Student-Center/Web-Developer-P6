/*const db = require("../models")
const User = db.user
duplicateEmailChecker = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if(err) {
            res.status(500).send({ message: err })
            return
        }
        if (user) {
            res.status(400).send({ message: err })
            return
        }
        next()
    })
}
const middlewareSignup = {
    duplicateEmailChecker
}
module.exports = middlewareSignup*/