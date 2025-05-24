const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    // Notifies all captains in the radius about the new ride
    rideController.confirmRide
)

router.get('/start-ride',
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('driverId').isString().withMessage('Invalid driver ID'),
    rideController.endRide
)

router.post('/:rideId/accept',
    body('driverId').isString().withMessage('Invalid driver ID'),
    rideController.acceptRide
);

router.post('/:rideId/cancel',
    rideController.cancelRide
);

router.get('/:rideId', rideController.getRideById);

module.exports = router;