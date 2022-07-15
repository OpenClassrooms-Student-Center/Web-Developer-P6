const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, sauceCtrl.creatThing);
router.get("/", auth, sauceCtrl.getAllThing);
router.put("/:id", auth, sauceCtrl.modifyThing);
router.delete("/:id", auth, sauceCtrl.deleteThing);
router.get("/:id", auth, sauceCtrl.getOneThing);

module.exports = router;
