const Razorpay = require('razorpay');
const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('Payment Controller initialized with:', {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
  FRONTEND_URL: process.env.FRONTEND_URL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing'
});

module.exports = {
  createOrder: async (req, res) => {
    try {
      console.log('Creating payment order with data:', {
        body: req.body,
        userId: req.user?._id,
        userEmail: req.user?.email
      });

      const { amount, services } = req.body;
      const user = req.user;

      const paymentLinkData = {
        amount: amount * 100,
        currency: "INR",
        accept_partial: false,
        description: "College Transportation Services",
        customer: {
          name: user.name || "College Name",
          email: user.email || "college@example.com",
          contact: user.phone || ""
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        notes: {
          services: JSON.stringify(services)
        },
        callback_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/payments/verify`,
        callback_method: "get"
      };

      console.log('Creating Razorpay payment link with:', paymentLinkData);
      const paymentLink = await razorpay.paymentLink.create(paymentLinkData);
      console.log('Razorpay payment link created:', {
        id: paymentLink.id,
        status: paymentLink.status,
        short_url: paymentLink.short_url
      });

      const payment = new Payment({
        collegeId: user._id,
        amount,
        services,
        paymentLinkId: paymentLink.id,
        status: 'created'
      });
      await payment.save();
      console.log('Payment document created:', {
        paymentId: payment._id,
        status: payment.status,
        collegeId: payment.collegeId
      });

      res.json({
        paymentLink: paymentLink.short_url,
        paymentLinkId: paymentLink.id
      });
    } catch (error) {
      console.error('Error creating payment link:', error);
      res.status(500).json({ message: 'Error creating payment link' });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      console.log('Payment verification started with query params:', req.query);
      
      const { razorpay_payment_link_id, razorpay_payment_id, razorpay_payment_link_status } = req.query;

      console.log('Checking payment status:', {
        payment_link_id: razorpay_payment_link_id,
        payment_id: razorpay_payment_id,
        status: razorpay_payment_link_status
      });

      // Only check if payment status is paid
      if (razorpay_payment_link_status !== 'paid') {
        console.log('Payment status not paid:', razorpay_payment_link_status);
        return res.redirect(`${process.env.FRONTEND_URL}/college/payment-success?error=true&message=Payment not completed`);
      }

      console.log('Payment status is paid, proceeding with verification');

      console.log('Fetching payment link details from Razorpay');
      const paymentLink = await razorpay.paymentLink.fetch(razorpay_payment_link_id);
      console.log('Razorpay payment link details:', {
        status: paymentLink.status,
        amount: paymentLink.amount,
        created_at: paymentLink.created_at
      });
      
      console.log('Finding payment document in database');
      const payment = await Payment.findOne({ paymentLinkId: razorpay_payment_link_id });
      if (!payment) {
        console.error('Payment document not found for:', razorpay_payment_link_id);
        return res.redirect(`${process.env.FRONTEND_URL}/college/payment-success?error=true&message=Payment not found`);
      }
      console.log('Found payment document:', {
        paymentId: payment._id,
        currentStatus: payment.status,
        collegeId: payment.collegeId
      });

      payment.razorpayPaymentId = razorpay_payment_id;
      payment.status = 'paid';
      await payment.save();
      console.log('Updated payment status to paid');

      console.log('Finding college document');
      const college = await User.findById(payment.collegeId);
      console.log(college)
      if (!college) {
        console.error('College not found for ID:', payment.collegeId);
        return res.redirect(`${process.env.FRONTEND_URL}/college/payment-success?error=true&message=College not found`);
      }
      console.log('Found college document:', {
        collegeId: college._id,
        currentServices: college.services,
        isPaid: college.isPaid
      });

      college.services = payment.services;
      college.isPaid = true;
      await college.save();
      console.log('Updated college services and payment status');

      // Redirect to frontend with success status
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = new URL('/college/payment-success', frontendUrl);
      redirectUrl.searchParams.append('razorpay_payment_id', razorpay_payment_id);
      redirectUrl.searchParams.append('razorpay_payment_link_id', razorpay_payment_link_id);
      redirectUrl.searchParams.append('razorpay_payment_link_status', razorpay_payment_link_status);
      
      console.log('Redirecting to frontend:', redirectUrl.toString());
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Error in payment verification:', error);
      console.error('Error stack:', error.stack);
      res.redirect(`${process.env.FRONTEND_URL}/college/payment-success?error=true&message=${error.message}`);
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      console.log('Getting payment status for:', req.params);
      const { paymentLinkId } = req.params;
      
      console.log('Finding payment document');
      const payment = await Payment.findOne({ paymentLinkId });
      if (!payment) {
        console.error('Payment not found for ID:', paymentLinkId);
        return res.status(404).json({ message: "Payment not found" });
      }
      console.log('Found payment:', {
        status: payment.status,
        services: payment.services
      });

      console.log('Fetching payment link from Razorpay');
      const paymentLink = await razorpay.paymentLink.fetch(paymentLinkId);
      console.log('Razorpay payment link status:', paymentLink.status);

      res.json({
        status: paymentLink.status,
        services: payment.services
      });
    } catch (error) {
      console.error('Error getting payment status:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Error getting payment status' });
    }
  }
}; 