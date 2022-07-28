const express = require("express");
const router = express.Router();
const max = require("../middleware/limit");

const verifyPassword = require("../middleware/verifyPassword");

const userCtrl = require("../controllers/user");

router.post("/signup", verifyPassword, userCtrl.signup);
router.post("/login", max.limiter, userCtrl.login);

module.exports = router;
