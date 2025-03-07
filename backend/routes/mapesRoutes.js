const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");
const { query, validationResult } = require("express-validator");

// Route to get coordinates
router.get('/coordinates',
    query('address')
    .isString()
    .trim()
    .matches(/^[a-zA-Z0-9\s,.-]+$/) // Allows letters, numbers, spaces, comma, period, and hyphen
    .withMessage("Address contains invalid characters")
    .isLength({ min: 3 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    mapController.getCoordinates
);



router.get('/getdistancetime',
    query('origin').isString().trim().isLength({ min: 3 }).withMessage("Origin is invalid"),
    query('destination').isString().trim().isLength({ min: 3 }).withMessage("Destination is invalid"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    mapController.getDistanceTime // Make sure this function exists
);

router.get('/getsuggestions', 
    query('input').isString().trim().isLength({ min: 3 }).withMessage("Input is invalid"), 
    mapController.getAutoCompleteSuggestions);




module.exports = router;