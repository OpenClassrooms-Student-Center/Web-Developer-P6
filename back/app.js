const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const path = require('path');
const app = express();
const cors = require('cors');
/* Routes api */
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


/* Mongo DB Connexion */
mongoose.connect('mongodb+srv://Alex:ebhrSVu6PVAIiaQ0@atlascluster.yhbyxcr.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

/* Middleware CORS policy */
app.use(cors());

/* Convert all response and get in json data */
app.use(express.json());

/* Helmet */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

/* Middleware image */
app.use('/images', express.static(path.join(__dirname, 'images'))); // gestion images de manière statiques


/* Route API */
app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);


module.exports = app;