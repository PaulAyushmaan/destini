const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create a new ride - requires user authentication
router.post('/create',
    // authMiddleware.authUser, // Commented out for testing
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
);

// Get fare estimate - requires user authentication
router.get('/get-fare',
    // authMiddleware.authUser, // Commented out for testing
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
);

// Confirm ride - requires captain authentication
router.post('/confirm',
    // authMiddleware.authCaptain, // Commented out for testing
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    // Notifies all captains in the radius about the new ride
    rideController.confirmRide
);

// Start ride - requires captain authentication
router.get('/start-ride',
    // authMiddleware.authCaptain, // Commented out for testing
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
);

// End ride - requires captain authentication
router.post('/end-ride',
    // authMiddleware.authCaptain, // Commented out for testing
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
);

module.exports = router;