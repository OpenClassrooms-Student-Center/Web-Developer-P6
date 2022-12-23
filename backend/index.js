const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauce")
const cors = require("cors")
const path = require("path")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Connection à MongoDB via mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@occursefullstacknodejse.qnnkqu4.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch(() => console.log("Connexion à MongoDB échouée"))



const app = express()
const port = 3000
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


app
    // Cors middleware pour éviter les erreurs de connexion à l'API
    .use(cors())
    .use(express.json())
    .use(limiter)


// Routes API
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)


// écoute de l'application express sur le port 3000
app.listen(port, () => {
    console.log(`Node application started at : http://localhost:${3000}`);
})


