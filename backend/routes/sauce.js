const express = require("express")
const { get } = require("http")
const router = express.Router()

const sauceCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")

router.get("/", auth, sauceCtrl.getAllSauces)
router.get("/:id", auth, sauceCtrl.getOneSauce)
router.post("/", auth, sauceCtrl.createSauce)

module.exports = router