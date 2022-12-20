const jsonwebtoken = require("jsonwebtoken")

module.exports = (req,res) => {
    try {
        const token = req.header.authorization.split(" ")[1]
        const decodedToken = jsonwebtoken.verify(token, "RANDOM_TOKEN_SECRET")
        const userId = decodedToken.userId
        req.auth = {
            userId: userId,
        }
    } catch (error) {
        res.status(401).json({ error })
    }
}