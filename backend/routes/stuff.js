const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/stuff");

router.get("/", stuffCtrl.getAllStuff);
router.get("/:id", stuffCtrl.getOneThing);
router.post("/", stuffCtrl.createThing);
router.put("/:id", stuffCtrl.modifyThing);
router.delete("/:id", stuffCtrl.deleteThing);

module.exports = router;
