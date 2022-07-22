// Modules
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
// Fin des modules

// Load env variables
require("dotenv").config();
const db = process.env;
// Fin variables env.

// Connection BSD via une externalisation des données de connexion sur fichier .env
mongoose
  .connect(
    "mongodb+srv://" +
      db.USER_DB +
      ":" +
      db.PASS_DB +
      "@" +
      db.CLUSTER_DB +
      "." +
      db.NAME_DB +
      "?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Fin de connexion

const app = express();

// Parametrage des headers (évite les err de cors)

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// Fin de parametrage
// BodyParser (rend le corps de la requète facilement exploitable)
app.use(bodyParser.json());
// Fin de BodyParser

// Routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
// Fin routes

module.exports = app;
