const jwt = require('jsonwebtoken');

require('dotenv').config()
const tokenSecret = process.env.TOKEN_SECRET;

console.log(`"${tokenSecret}"`);

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `"${tokenSecret}"`);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw '403: unauthorized request';
    } else {
      req.userId = userId;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};