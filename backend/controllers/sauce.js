//imports
const Sauce = require('../models/sauce');
const fs = require('fs');

// POST function that allows a user to create a sauce
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce ({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: [],
        usersDisliked: [],
        userId: req.body.sauce.userId
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
// GET function that returns a single sauce with a specific ID 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};
// PUT function that allows an authorized user to modify a sauce
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    /* if/else statement to determine how to change the sauce data, depending on if the
     user is updating the file sent or not
     if the authorized user is updating the file/image sent, the sauce is returned as a string 
     */
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            likes: req.body.sauce.likes,
            dislikes: req.body.sauce.dislikes,
            imageUrl: url + '/images/' + req.file.filename,
            mainPepper: req.body.sauce.mainPepper,
            usersLiked: req.body.sauce.usersLiked,
            usersDisliked: req.body.sauce.usersDisliked,
            userId: req.body.sauce.userId
        };
    }
    // else, the sauce is returned as JSON
    else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            heat: req.body.heat,
            likes: req.body.likes,
            dislikes: req.body.dislikes,
            imageUrl: req.body.imageUrl,
            mainPepper: req.body.mainPepper,
            usersLiked: req.body.usersLiked,
            usersDisliked: req.body.usersDisliked,
            userId: req.body.userId
        };
    }
    // Sends the updated sauce
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(201).json({
                message: 'Updated Successfully'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
// DELETE function that allows an authorized user delete a sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            if(!sauce) {
                return res.status(404).json({
                    error: new Error('No Sauce Found')
                });
            }
            // prevents unauthorized users from deleting a sauce
            if (sauce.userId != req.auth.userId) {
                return res.status(400).json({
                    error: new Error('Unauthorized request')
                });
            }
            // deletes the image file linked to the sauce
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                // deletes sauce
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
            
        }
    )
    
};
// GET function that returns an array of all sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {
    // First, gather the sauce to be liked
   Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
        /* if the user likes the sauce, and they are not already in the usersLiked array,
         put them in the array and increase the total amount of likes for the sauce + 1. 
        */
        if (req.body.like == 1 && !sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += 1;
        }
        // same as above, but for dislikes
        if (req.body.like == -1 && !sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes += 1;
        }
        /* if the user un-likes, or un-dislikes, this gets them out of the array and subtracts from the 
         likes/dislikes property 
         */
        if (req.body.like == 0) {
            // If the user is in the usersLiked array, this removes them from it, and subtracts the like property
            if (sauce.usersLiked.includes(req.body.userId)) {
                let tempIndexOf = sauce.usersLiked.indexOf(req.body.userId);
                sauce.usersLiked.splice(tempIndexOf, 1);
                sauce.likes -= 1;
            }
            // same as above, but for the usersDisliked array and dislike property respectively
            if (sauce.usersDisliked.includes(req.body.userId)) {
                let tempIndexOf = sauce.usersDisliked.indexOf(req.body.userId);
                sauce.usersDisliked.splice(tempIndexOf, 1);
                sauce.dislikes -= 1;
            }
            
        }
        // updates the sauce's likes/dislikes, and the usersLiked/usersDisliked arrays
        Sauce.updateOne({_id: sauce.id}, sauce).then(
            () => {
                res.status(201).json({
                    message: 'Updated Successfully'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
        
        
    }
   ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
   );
}