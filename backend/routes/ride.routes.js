const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Get available rides (must be before /:rideId to prevent conflicts)
router.get('/available',
    authMiddleware.authCaptain,
    rideController.getAvailableRides
);

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
);

router.get('/get-fare',
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
);

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    // Notifies all captains in the radius about the new ride
    rideController.confirmRide
);

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
);

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
);

router.post('/schedule',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    body('scheduleStartDate').isISO8601().withMessage('Invalid schedule date'),
    body('schedulePeriod').isString().isIn(['one-time', '15-days', '1-month', '3-months', '6-months', '1-year']).withMessage('Invalid schedule period'),
    rideController.scheduleRide
);

// Edit scheduled ride (PUT)
router.put('/:rideId/edit-schedule',
    authMiddleware.authUser,
    body('scheduleStartDate').isISO8601().withMessage('Invalid date'),
    body('schedulePeriod').isString().isIn(['one-time','15-days','1-month','3-months','6-months','1-year']).withMessage('Invalid period'),
    rideController.editScheduledRide
);

// Get all scheduled rides for the logged-in user
router.get('/scheduled', authMiddleware.authUser, rideController.getScheduledRides);

router.get("/get_rides",
    authMiddleware.authUser,
    rideController.getRides
);

// Dynamic routes should be at the bottom
router.post('/:rideId/accept',
    authMiddleware.authCaptain,
    rideController.acceptRide
);

router.post('/:rideId/cancel',
    rideController.cancelRide
);

router.get('/:rideId', rideController.getRideById);

module.exports = router;