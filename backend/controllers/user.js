const jwt = require('jsonwebtoken'); //package to security token
const bcrypt = require('bcrypt'); // package to hash & salt
const User = require('../models/user');

exports.signup = (req, res, next) => { //midleware to create a new user 
    bcrypt.hash(req.body.password, 10) //bcrypt hash & salt to secure connexion
      .then(hash => { // recuperation of hash mdp
        const user = new User({ //model mongoose for new user with récuperation of email request & hash
          email: req.body.email,
          password: hash
        });
        user.save() //user save in DB
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error })); //if user already exist
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => { //Middleware to connect an existing user
    User.findOne({ email: req.body.email }) //search users in DB
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // if not existing user
        }
        bcrypt.compare(req.body.password, user.password) //bcryp comparaison hash & id
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' }); // if hash or user is not good
            }
            res.status(200).json({ // if ok, send json objet with user Id et Token
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET', //Token encryption key that can be made more complex in production
                { expiresIn: '72h' } //configuration of expiration date 
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    };