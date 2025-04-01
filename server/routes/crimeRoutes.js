const express = require("express");
const router = express.Router();
const CrimeController = require("../controllers/CrimeController"); // Adjust path as needed
const auth = require("../middlewares/authMiddleware"); // Middleware for role checking

router.use(auth.authenticate); //Authentication

router.get("/nearby", auth.authorize(["Police", "Admin"]), CrimeController.getNearbyCrimes);
router.get("/:id", auth.authorize(["Citizen", "Police", "Admin"]), CrimeController.getCrimeById);
router.get("/", auth.authorize(["Police", "Admin"]), CrimeController.getAllCrimes);
router.post("/", auth.authorize(["Citizen"]), CrimeController.addCrimeReport);

module.exports = router;
