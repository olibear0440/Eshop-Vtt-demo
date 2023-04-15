const express = require("express");
const vttCtrl = require("../controllers/vtt");
const multer = require("../multer-config");

/*********************router d'express*************** */
const router = express.Router();

router.post("/createVtt", multer, vttCtrl.createVtt);
router.get("/", vttCtrl.getAllVtts);
router.get("/:id", vttCtrl.getOneVtt);
router.put("/:id", multer, vttCtrl.modifyVtt);
router.delete("/:id", vttCtrl.deleteVtt);

module.exports = router;
