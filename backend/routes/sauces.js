// This route conatins fonction to to apply on "sauce path"


const express = require('express'); // need express
const router = express.Router(); // Construction of router with express method 
const saucesCtrl = require('../controllers/sauces'); //Import of controller
const auth = require('../middleware/auth'); //import Middleware to authentification path
const multer = require('../middleware/multer-config'); // import multer configuration

router.get('/', auth, saucesCtrl.getAllSauces); // Send array off all sauces
router.post('/', auth, multer, saucesCtrl.createSauce); //route to create a sauce : Verify login, caption & save image etc...
router.get('/:id', auth, saucesCtrl.getOneSauce);// send one sauce : based on id & auth
router.put('/:id', auth, multer, saucesCtrl.modifySauce); // route to modify sauce inclunding gestion of image
router.delete('/:id', auth, saucesCtrl.deleteSauce); // route to delete sauce only for user who create sauce
router.post('/:id/like', auth,saucesCtrl.likeSauce); //route to like & dislike sauce for userId furnished

module.exports = router;