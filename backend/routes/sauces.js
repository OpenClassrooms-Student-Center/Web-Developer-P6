const express = require("express")
const router = express.Router()

const sauceController = require("../controllers/sauces")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")


router.get("/",  sauceController.getAllSauces)
router.get("/:id",  sauceController.getOneSauce)

router.post("/",  multer, sauceController.createSauce)


module.exports = router