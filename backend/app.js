
const { error } = require("console");
const express = require("express");
const app = express();
const mongoose = require('mongoose') ; 

mongoose.connect('mongodb+srv://Luke:boXEjHiSruy9TOu8@cluster0.jwxjy6n.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
      console.log('Successfully connected to mongoDB Atals database') ;
})
.catch((error)=> {
      console.log('Unable to connect to the database');
      console.error(error);
})

app.use((req, res, next) => {
  console.log("response successfully");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "My first response" });
  // res.status(200).json({message : 'My first response'});
  next();
});

module.exports = app;
