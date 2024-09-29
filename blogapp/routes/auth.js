const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const csrf = require("../middlewares/csrf");

router.get("/register",csrf, authController.ShowRegisterPage);
router.post("/register", authController.Register);

router.get("/login",csrf, authController.ShowLoginPage);
router.post("/login", authController.Login);
router.get("/logout",csrf, authController.Logout);

module.exports = router;