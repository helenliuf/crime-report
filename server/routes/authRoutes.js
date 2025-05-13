const express = require('express');
const auth = require("../middlewares/authMiddleware"); // Middleware for role checking

const router = express.Router();

// GET route
router.get('/validatetoken', auth.authenticate, (req, res) => {
    res.set('Cache-Control', 'no-store'); // Disable caching
    res.sendStatus(200); // Send a simple 200 status
});

module.exports = router;
