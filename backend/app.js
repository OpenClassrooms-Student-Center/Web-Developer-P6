const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require("helmet");
const nocache = require('nocache');

const userRoutes = require('./routes/user'); // add user route
const sauceRoutes = require('./routes/sauces'); //add sauce route

// Connect to mongodb
mongoose.connect(process.env.MONGO_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(helmet());// Sécurization of Express with define Http header - https://www.npmjs.com/package/helmet#how-it-works
// helmet is used for several reasons including the implementation of X-XSS-Protection to enable cross-site scripting (XSS) filtering in web browsers


app.use(nocache());//Turns off browser caching

app.use(express.json());

// Middleware Header to bypass errors by unblocking some CORS security systems, so that everyone can make requests from their browser
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// indicate that resources can be shared from any origin
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //indicate the headers that will be used after the cross-origin pre-check to give authorization
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');  // indicate the authorised methods for HTTP requests
    res.setHeader('Content-Security-Policy', "default-src 'self'");// allow this server to provide scripts for the visited page
    next();
});

// Static management of the image resource
// Midleware that allows to load files that are in the images directory
app.use('/images', express.static(path.join(__dirname, 'images'))); 

// Routes to manage all expected API resources - Routing
// Middleware that will forward requests to these urls to the corresponding routes

// Will serve the routes dedicated to the sauces
app.use('/api/sauces', sauceRoutes);
// Will serve the routes dedicated to the users
app.use('/api/auth', userRoutes);
 
module.exports = app;
