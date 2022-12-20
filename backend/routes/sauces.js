const express = require("express")
const router = express.Router()

const sauceController = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")


router.get("/", auth, sauceController.getAllSauces)
router.get("/:id", auth, sauceController.getOneSauce)

router.post("/", auth, multer, sauceController.createSauce)


module.exports = router