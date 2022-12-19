const express = require("express")
const mongoose = require("mongoose")

const app = express()
const port = 3000

mongoose.connect("mongodb+srv://jssdestroyerman:Monmotdepasse@occursefullstacknodejse.qnnkqu4.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch(() => console.log("Connexion à MongoDB échouée"))


app.listen(port, () => console.log(`Notre application node est lancée sur : http://localhost:${port}`))