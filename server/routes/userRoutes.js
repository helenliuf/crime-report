// ###### Router Setup ######

const express = require("express");
const UserController = require("../controllers/userController");
const router = express.Router();

router.post("/register", UserController.register);
router.get("/login", UserController.login);

module.exports = router;
