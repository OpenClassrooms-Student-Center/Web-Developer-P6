const jwt = require('jsonwebtoken'); // Import JsonToken to protect route & verity authentification user to resquesting

// This middleware will be applied to all routes to secure them
module.exports = (req, res, next) => {
  try {
    // Retrieve the token from the header of the authorization request, retrieving only the second element of the array (because split)
    const token = req.headers.authorization.split(' ')[1];
    // We check the decoded token with the secret key initiated with the creation of the initially encoded token (Cf Controller user), the keys must match
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    // We verify that the userId sent with the request matches the userId encoded in the token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Identification utilisateur impossible'; // if the token does not match the userId: error
    } else {
      next(); // if everything is valid we go to the next middleware
    }
  } catch (error) { // authentication problem if error in registrations
    res.status(401).json({
      error: error | 'Requête non authentifiée!'
    })
  }
}