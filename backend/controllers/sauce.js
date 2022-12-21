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

exports.createSauce = (req,res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new sauceSchema({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    console.log(sauce);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

// not working voir github
exports.modifySauce = (req,res) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; 

    sauceSchema.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id  })
        .then(() => res.status(200).json({ message: "objet modifié" }))
        .catch((err) => res.status(400).json({ error: err }))
}
// erreur -> voir le github 
exports.deleteSauce = (req,res) => {
    sauceSchema.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "object supprimé" }))
        .catch((err) => res.status(400).json({ error: err }))
}