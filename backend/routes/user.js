const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user'); // upload "rule" for user"

router.post('/signup', userCtrl.signup); //route to new user
router.post('/login', userCtrl.login); //route to user already known

module.exports = router;