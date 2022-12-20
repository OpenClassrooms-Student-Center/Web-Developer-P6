const express = require("express")
const { get } = require("http")
const router = express.Router()

const sauceCtrl = require("../controllers/sauce")

router.get("/", sauceCtrl.getAllSauces)
router.get("/:id", sauceCtrl.getOneSauce)
router.post("/",)

module.exports = router