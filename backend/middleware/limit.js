const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,//5min in ms
    max: 5,
    message: "Trop de tentatives de connexion. Compte bloqué pour 5 minutes"
})

module.exports = { limiter }

// Limit of request per user based on IP to limit forcebrute attack