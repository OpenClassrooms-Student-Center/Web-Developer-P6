const sauce = require("../models/sauce")
const sauceModel = require("../models/sauce")

exports.getAllSauces = (req,res) => {
    sauceModel.find()
        .then(sauce => res.status(200).json({ sauces: sauce }))
        .then(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req,res) => {
    sauceModel.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }))
}

exports.createSauce = (req,res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new sauceModel({
        ...sauceObject,
        // userId: req.auth.user,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}