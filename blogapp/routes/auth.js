const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/register", authController.ShowRegisterPage);

router.post("/register", authController.Register);

module.exports = router;