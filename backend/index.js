const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauce")
const cors = require("cors")
const path = require("path")

// Connection à MongoDB via mongoose
mongoose.connect("mongodb+srv://jssdestroyerman:Monmotdepasse@occursefullstacknodejse.qnnkqu4.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch(() => console.log("Connexion à MongoDB échouée"))



const app = express()
const port = 3000


app
    // Cors middleware pour éviter les erreurs de connexion à l'API
    .use(cors())
    .use(express.json())


// Routes API
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)


// écoute de l'application express sur le port 3000
app.listen(port, () => {
    console.log(`Node application started at : http://localhost:${3000}`);
})


