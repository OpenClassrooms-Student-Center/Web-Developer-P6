const express = require('express');
const mongoose = require('mongoose');

const app = express();
//const auth = require('./middleware/auth');
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(express.json());

mongoose.connect('mongodb+srv://VanG:piq13sauce*@cluster0.iumkbc8.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



/*app.post('/api/sauces/:id/like',auth, (req, res,next) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});*/




app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;