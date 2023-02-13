const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');

router.get('/sauces', auth, sauceCtrl.getAllSauces);
router.get('/sauces/:id', auth, sauceCtrl.getOneSauce);
router.post('/sauces', auth, multer, sauceCtrl.createSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauce);
router.post('/sauces/:id/like', auth, multer, sauceCtrl.likeSauce);

module.exports = router;

