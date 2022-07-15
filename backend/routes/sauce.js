const express = require("express");
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");

router.post("/", sauceCtrl.creatThing);

router.get("/", sauceCtrl.getAllThing);
router.put("/:id", sauceCtrl.modifyThing);
router.delete("/:id", sauceCtrl.deleteThing);
router.get("/:id", sauceCtrl.getOneThing);
module.exports = router;
