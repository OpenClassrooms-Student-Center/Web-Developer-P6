const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user")
const sauceRoutes = require("./routes/sauces")
const cors = require("cors")
const path = require("path")


mongoose.connect("mongodb+srv://jssdestroyerman:Monmotdepasse@occursefullstacknodejse.qnnkqu4.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch(() => console.log("Connexion à MongoDB échouée"))



const app = express()
const port = 3000

app
    .use(cors())
    .use(express.json())



app.use("/api/auth", userRoutes)
app.use("/api/sauces", sauceRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));


app.listen(port, () => {
    console.log(`Node application started at : http://localhost:${3000}`);
})


