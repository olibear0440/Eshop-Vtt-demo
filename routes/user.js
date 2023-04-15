const express = require("express");
const userCtrl = require("../controllers/user");

/*********************router d'express*************** */
const router = express.Router();

/*** Middleware pour logger dates de requete */
router.use((req, res, next) => {
  const event = new Date();
  console.log("User Time:", event.toString());
  next();
});

/********************routage des users************** */
router.post("/createUser", userCtrl.createUser);
router.post("/loginUser", userCtrl.loginUser);
router.get("/", userCtrl.getAllUsers);
router.get("/:id", userCtrl.getOneUser);
router.put("/:id", userCtrl.modifyUser);
router.delete("/:id", userCtrl.deleteUser);

module.exports = router;
