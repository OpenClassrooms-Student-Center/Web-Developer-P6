const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require('path');
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const dbDatabase = process.env.DB_DATABASE;

mongoose
	.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.x0elc.mongodb.net/${dbDatabase}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
