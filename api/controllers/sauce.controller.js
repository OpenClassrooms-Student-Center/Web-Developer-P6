const config = require("../config/auth.config")
const db = require("../models")
const Sauce = db.sauce
const fs = require('fs')


exports.addsauces = (req, res, next) => {
    const currentSauce = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...currentSauce,
        likes: 0,
        dislikes: 0,
        usersLiked: '',
        usersDisliked: '',
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save((err, sauce) => {
        if (err) {
            res.status(400).send({ message: err })
            return
        }
        if (!sauce) {
            res.status(404).send({ message: err })
            return
        }
        res.status(200).send({ message: err })
    })
}
exports.updatesauces  = (req, res, next) => {
    if(req.file) { 
        Sauce.findOne({
            _id: req.params.id,
        }).exec((err, sauce) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (!sauce) {
                res.status(404).send({ message: err })
                return
            }
            const last_filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + last_filename, () => {});
        })
    }
    const updateSauce = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { 
        ...updateSauce, _id: req.params.id 
    }).exec((err, sauce) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (!sauce) {
            res.status(404).send({ message: err })
            return
        }
        res.status(200).send({ message: err })
    })
}
exports.onesauces = (req, res) => {
    Sauce.findOne({
        _id: req.params.id,
    }).exec((err, sauce) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (!sauce) {
            res.status(404).send({ message: err })
            return
        }
        res.status(200).send(sauce) 
    })
}
exports.deletesauces = (req, res) => {
    Sauce.deleteOne({
        _id: req.params.id,
    }).exec((err, sauce) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (!sauce) {
            res.status(404).send({ message: err })
            return
        }
        res.status(200).send({ message: err })
    })
}
exports.allsauces = (req, res) => {
    Sauce.find(function(err, sauce){
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        res.status(200).send(sauce)
    })
}

exports.likesauces = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    }).exec((err, sauce) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (!sauce) {
            res.status(404).send({ message: err })
            return
        }
    
        let i = 0;
        let tabLikes = []; let tabDislikes = [];
        let already_liked = 0; let already_disliked = 0;
        let type_like = req.body.like;
        let user_id = req.body.userId;

        if(sauce.usersLiked) {
            tabLikes = JSON.parse(sauce.usersLiked);
            while(i < tabLikes.length) {
                if(tabLikes[i] == user_id) { 
                    if(type_like == 0 || type_like == -1) {
                        tabLikes.splice(i, 1); 
                        sauce.likes --;
                    }
                    already_liked = 1;
                }
                i ++;
            }
        }
        if(sauce.usersDisliked) {
            tabDislikes = JSON.parse(sauce.usersDisliked); i = 0;
            while(i < tabDislikes.length) {
                if(tabDislikes[i] == user_id) { 
                    if(type_like == 0 || type_like == 1) {
                        tabDislikes.splice(i, 1); 
                        sauce.dislikes --;
                    }
                    already_disliked = 1;
                }
                i ++;
            }
        }

        if(type_like == 1 && already_liked == 0) {
            tabLikes.push(user_id);
            sauce.likes ++; 
        }
        if(type_like == -1 && already_disliked == 0) {
            tabDislikes.push(user_id);
            sauce.dislikes ++; 
        }

        Sauce.updateOne({ _id: req.params.id }, {
                likes: sauce.likes, 
                dislikes: sauce.dislikes, 
                usersLiked: JSON.stringify(tabLikes), 
                usersDisliked: JSON.stringify(tabDislikes)
        }).exec((err, sauce) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (!sauce) {
                res.status(404).send({ message: err })
                return
            }
            res.status(200).send({ message: "done" })
        })
    })
}; 
