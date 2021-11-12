const Sauce = require('../models/sauces'); // import sauce model
const fs = require('fs'); //import Nodefs to manage file

exports.createSauce = (req, res, next) => { // logic "metier" to create sauce 
  const sauceObject = JSON.parse(req.body.sauce); //parse to obtain usable object
  delete sauceObject._id; // We delete the automatically generated id sent by the front-end. The id of the sauce is created by the MongoDB database during the creation in the database
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //resolve complete url ==> req protocol is http ==> host is serverport urel consideration ==> folder images ==> recuperation of filename
  });
  sauce.save() //save sauce in dB
    .then(() => res.status(201).json({ message: 'sauce enregistrée !'})) //send response 201 & message 
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // logic "metier" to see a unique sauce
  Sauce.findOne({
    _id: req.params.id //method findOne() with id comparaison object =>id is the same that id request
  }).then( 
    (sauce) => {
      res.status(200).json(sauce); //retour response & object
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error //return 404 to say " object is not found"
      });
    }
  );
};

exports.modifySauce = (req, res, next) => { //logic "metier" to modify a sauce
  const sauceObject = req.file ? // If modification contains an image => Using the ternary operator as a conditional structure.
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // method updateOne() on  Sauce model. This allows us to update sauce that corresponds to the object we pass as the first argument. We also use the id parameter passed in the request and replace it with the Sauce passed as the second argument.
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //method findOne to find Sauce with correspondante id
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // To extract this file, we get the url of the sauce, and we split it around the string, so the file name
      fs.unlink(`images/${filename}`, () => { //call fs unlink to erase file
        Sauce.deleteOne({ _id: req.params.id }) //Erase the file with same id on DB
          .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then( //methode find to obtain complete liste
    (sauces) => {
      res.status(200).json(sauces); //response ok with data array
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
  Sauce.findOne({ _id: req.params.id }) //method find
  .then(sauce => {
    const userId = req.body.userId //declare userId
    const like = req.body.like //declare like
 
    sauce.usersLiked = sauce.usersLiked.filter(user => user !== userId) //filter to limit like & dislike for unique user
    sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== userId)
    
    if (like === 1) {
      sauce.usersLiked.push(userId) //Send like in DB for unique user
    }
    if (like === -1) {
      sauce.usersDisliked.push(userId) //send unlike in db for unique user
    }
 
    sauce.likes = sauce.usersLiked.length // declare numbre of like
    sauce.dislikes = sauce.usersDisliked.length // declare number of dislike
 
    sauce.save() //save in db user like or dislike 
      .then(() => res.status(200).json({ message: 'Like modifié !'}))
      .catch(error => res.status(400).json({ error }));
 
  })
  .catch(error => res.status(500).json({ error }));
};