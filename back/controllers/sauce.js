const Sauce = require('../models/sauceModel');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

exports.getAllSauces = (req, res) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};




const upload = multer({ storage });


exports.createSauce = (req, res, next) => {
  // Store the data sent by the front-end as form-data in a variable by converting it to a JavaScript object
  const bodypost = JSON.parse(req.body.sauce);
  // Remove the id generated automatically and sent by the front-end. The id of the sauce is created by MongoDB when it is created in the database
  delete bodypost._id;
  // Create an instance of the Sauce model
  const sauce = new Sauce({
    ...bodypost,
    // Modify the image URL, we want the complete URL, something dynamic with the URL segments
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  // Save the sauce in the database
  sauce.save()
  // Send a response to the frontend with a 201 status code, otherwise the request will timeout
  .then(() => {
    res.status(201).json({
      message: 'Sauce enregistrée !'
    });
  })
  // Add an error code in case of a problem
  .catch(error => res.status(400).json({
    error
  }));
};


exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({
    _id: req.params.id
  })
  // Si ok on retourne une réponse et l'objet
  .then(sauce => res.status(200).json(sauce))
  // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
  .catch(error => res.status(404).json({
    error
  }));
};



exports.updateSauce = (req, res) => {
  const sauceObject = req.file ?
  // Si il existe déjà une image
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; 
  // Si il n'existe pas d'image
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Sauce mise à jour !' }))
  .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then(sauce => 
    {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`,() => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({ error })); 
      });
    });
  };
  
  exports.likeSauce = (req, res, next) => {
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;
    
    Sauce.findOne({ _id: sauceId })
    .then(sauce => {
      if (sauce.usersLiked.includes(userId)) {
        // User has already liked the sauce, remove like
        sauce.usersLiked = sauce.usersLiked.filter(id => id !== userId);
        sauce.likes -= 1;
      } else if (sauce.usersDisliked.includes(userId)) {
        // User has already disliked the sauce, remove dislike
        sauce.usersDisliked = sauce.usersDisliked.filter(id => id !== userId);
        sauce.dislikes -= 1;
      }
      if (like === 1) {
        // Add like
        sauce.usersLiked.push(userId);
        sauce.likes += 1;
      } else if (like === -1) {
        // Add dislike
        sauce.usersDisliked.push(userId);
        sauce.dislikes += 1;
      }
      
      return sauce.save();
    })
    .then(() => res.status(200).json({ message: 'Statut de la sauce mis à jour !' }))
    .catch(error => res.status(400).json({ error }));
  };
  
  
  
  
