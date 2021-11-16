const express = require('express');
const router = express.Router();


const max = require("../middleware/limit")

const userCtrl = require('../controllers/user'); // upload "rule" for user"

router.post('/signup',max.limiter, userCtrl.signup); //route to new user
router.post('/login',max.limiter, userCtrl.login); //route to user already known

module.exports = router;