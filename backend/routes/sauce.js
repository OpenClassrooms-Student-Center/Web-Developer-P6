const express = require('express');
const router = express.Router();
// imports authentication and multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// imports the sauce controller to get the exports to send
const sauceCtrl = require('../controllers/sauce');

// routes for all of the CRUD functions in the controller to the API
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;