const express = require('express');
const router = express.Router();
const { authUser } = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');

console.log('Payment Controller:', paymentController);

// Middleware to handle async errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new payment order
router.post('/create-order', authUser, function(req, res) {
    paymentController.createOrder(req, res);
});

// Verify payment after completion
router.get('/verify', authUser, function(req, res) {
    paymentController.verifyPayment(req, res);
});

// Get payment status
router.get('/status/:paymentLinkId', authUser, function(req, res) {
    paymentController.getPaymentStatus(req, res);
});

module.exports = router; 