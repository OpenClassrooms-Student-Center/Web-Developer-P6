const express = require('express');
const router = express.Router();
// imports the user controller
const userCtrl = require('../controllers/user');
// user routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;