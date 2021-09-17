const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const authorChecker = require("../middleware/authorChecker");
const oneRate = require("../middleware/oneRate");

const saucesCtrl = require("../controllers/sauces");

router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, authorChecker, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, oneRate, saucesCtrl.likeSauces);

module.exports = router;
