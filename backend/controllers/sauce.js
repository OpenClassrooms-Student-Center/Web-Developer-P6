const sauceSchema = require("../models/sauce")


exports.getAllSauces = (req,res) => {
    sauceSchema.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req,res) => {
    sauceSchema.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}