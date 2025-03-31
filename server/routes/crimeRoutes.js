const express = require("express");
const router = express.Router();
const CrimeController = require("../controllers/CrimeController"); // Adjust path as needed
const auth = require("../middlewares/authMiddleware"); // Middleware for role checking

router.use(auth.authenticate); //Authentication

router.get("/", CrimeController.getAllCrimes);
router.get("/:id", CrimeController.getCrimeById);

module.exports = router;
