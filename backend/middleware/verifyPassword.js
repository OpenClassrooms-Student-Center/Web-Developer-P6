const passwordSchema = require("../models/password");

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    //return res.status(400,"8 caratères minimun").send({message: 'Mot de passe pas assez fort ! ' + passwordSchema.validate(req.body.password, {list:true})});
    res.writeHead(
      400,
      '{"message":"Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces"}',
      {
        "content-type": "application/json",
      }
    );
    res.end("Format de mot de passe incorrect");
  } else {
    next();
  }
};
