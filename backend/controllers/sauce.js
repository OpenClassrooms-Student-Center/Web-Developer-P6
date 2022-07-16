const fs = require("fs");
const sauce = require("../models/sauce");

// Get all sauces in db
exports.getAllSauces = (req, res, next) => {
  sauce
    .find()
    .then((newSauce) => res.status(200).json(newSauce))
    .catch((error) => res.status(400).json({ error }));
};

// Get an specific sauce (id params)
exports.getOneSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((newSauce) => res.status(200).json(newSauce))
    .catch((error) => res.status(404).json({ error }));
};

// Create new sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const newSauce = new sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: "",
    usersDisliked: "",
  });
  newSauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Nouvelle sauce insérée avec succès !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Update sauce existing
exports.updateSauce = (req, res, next) => {
  if (req.file) {
    // Delete last registered if user load a new img
    sauce
      .findOne({ _id: req.params.id })
      .then((newSauce) => {
        const last_filename = newSauce.imageUrl.split("/images/")[1];
        fs.unlink("images/" + last_filename, () => {});
      })
      .catch((error) =>
        console.log("Echec de la suppression de l'ancienne image.")
      );
  }
  setTimeout(() => {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    sauce
      .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  }, 250);
};

// Delete sauce
exports.deleteSauce = (req, res, next) => {
  sauce
    .findOne({ _id: req.params.id })
    .then((newSauce) => {
      const filename = newSauce.imageUrl.split("/images/")[1];
      fs.unlink("images/" + filename, () => {
        sauce
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// (dis)like sauce
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      // nouvelles valeurs à modifier
      const newValues = {
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
        likes: 0,
        dislikes: 0,
      };
      // Différents cas:
      switch (like) {
        case 1: // CAS: sauce liked
          newValues.usersLiked.push(userId);
          break;
        case -1: // CAS: sauce disliked
          newValues.usersDisliked.push(userId);
          break;
        case 0: // CAS: Annulation du like/dislike
          if (newValues.usersLiked.includes(userId)) {
            // si on annule le like
            const index = newValues.usersLiked.indexOf(userId);
            newValues.usersLiked.splice(index, 1);
          } else {
            // si on annule le dislike
            const index = newValues.usersDisliked.indexOf(userId);
            newValues.usersDisliked.splice(index, 1);
          }
          break;
      }
      // Calcul du nombre de likes / dislikes
      newValues.likes = newValues.usersLiked.length;
      newValues.dislikes = newValues.usersDisliked.length;
      // Mise à jour de la sauce avec les nouvelles valeurs
      Sauce.updateOne({ _id: sauceId }, newValues)
        .then(() => res.status(200).json({ message: "Sauce notée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
