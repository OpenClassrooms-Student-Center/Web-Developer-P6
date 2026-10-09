// imports
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// route imports
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

app.use(express.json());

// connects to mongoDB database for this project 
mongoose.connect('mongodb+srv://reesegbrown:Umbrella1!@cluster0.m9bylxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log('Unable to connect');
        console.error(error);
    });

// fixes CORS issue
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
 
app.use('/images', express.static(path.join(__dirname, 'images')));
// connects to routes to the correct URL paths to use the exports
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth/', userRoutes);

module.exports = app;

