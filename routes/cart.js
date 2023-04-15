const express = require("express");
const cartCtrl = require("../controllers/cart");

/*********************router d'express*************** */
const router = express.Router();

router.post("/", cartCtrl.addToCart);
router.get("/", cartCtrl.getCart);
router.get("/:id", cartCtrl.getOneCart);
router.delete("/:id/:productId", cartCtrl.deleteProductCart);

module.exports = router;
