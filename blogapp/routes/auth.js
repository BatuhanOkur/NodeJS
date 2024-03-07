const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/register", authController.ShowRegisterPage);
router.post("/register", authController.Register);

router.get("/login", authController.ShowLoginPage);
router.post("/login", authController.Login);
router.get("/logout", authController.Logout);

module.exports = router;