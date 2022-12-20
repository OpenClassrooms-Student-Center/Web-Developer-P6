const express = require("express")
const router = express.Router()
const userController = require("../controllers/user")
// const auth = require("../middleware/auth") --> ajouter sur la route des sauces

router.post("/signup", userController.signup)
router.post("/login", userController.login)

module.exports = router