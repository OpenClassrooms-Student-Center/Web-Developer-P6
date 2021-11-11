const express = require('express');
require('dotenv').config;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


const userRoutes = require('./routes/user'); // add user route
const sauceRoutes = require('./routes/sauces'); //add sauce route

// Connect to mongodb
mongoose.connect(`${process.env.MONGO_DSN}`,{
  useNewUrlParser: true,  //deprecation warnings = avertissement fonctionnalité,biblio existante va être modifiée,supprimée,remplacée//
  useUnifiedTopology: true,})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(bodyParser.json());

// open call http from all server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))); 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
 
module.exports = app;
