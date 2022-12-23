const jwt = require('jsonwebtoken');

// Vérification de l'userId présent dans le token avec jwt.verify()
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, '3ed860b6-f985-47b0-be14-5d403c75cde0');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};