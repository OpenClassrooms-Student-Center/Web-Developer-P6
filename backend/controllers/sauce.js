const sauceSchema = require("../models/sauce")
const fs = require("fs")


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

    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req,res) => {

    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    sauceSchema.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id  })
        .then(() => res.status(200).json({ message: "objet modifié" }))
        .catch((err) => res.status(400).json({ error: err }))
}

exports.deleteSauce = (req,res) => {
    sauceSchema.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            
            fs.unlink(`images/${filename}`, () => {
                sauceSchema.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !"}))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.thumbSauce = (req,res) => {

    console.log(req.body);
    if (req.body.like === 1) {
        sauceSchema.updateOne({ _id: req.params.id }, { $inc: {likes: req.body.like++}, $push: {usersLiked: req.body.userId} })
            .then(() => res.status(200).json({ message: "Like ajouté !" }))
            .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
        sauceSchema.updateOne( { _id: req.params.id }, { $inc: {dislikes: req.body.like--} , $push: {usersDisliked: req.body.userId}})
            .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
            .catch(error => res.status(400).json({ error }))
    } else {
        sauceSchema.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) { 
                    sauceSchema.updateOne({ _id: req.params.id }, { $inc: {likes: -1}, $pull: {usersLiked: req.body.userId} })
                        .then(() =>  res.status(200).json({ message: 'Like supprimé !' }))
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    sauceSchema.updateOne({ _id: req.params.id }, { $inc: {dislikes: +1}, $pull: {usersDisliked: req.body.userId} })
                        .then(() => res.status(200).json({ message: "Dislike supprimé !" }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}