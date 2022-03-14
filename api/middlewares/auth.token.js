const jwt = require("jsonwebtoken")
const config = require("../config/auth.config")

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'].slice(7)
    if (!token){
        return res.status(403).send({ message: "api return no token provide" })
    }
    jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "api return unauthorized" })
        }
        req.userId = decoded.id
        next()
    })
}
const authToken = {
    verifyToken
}
module.exports = authToken