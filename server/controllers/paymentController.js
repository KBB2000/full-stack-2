const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getPayments = async (req, res, next) => {
  try {
    let query;

    // If customer ID is provided, get payments for that customer
    if (req.params.customerId) {
      query = Payment.find({ customer: req.params.customerId });
    } else {
      query = Payment.find();
    }

    const payments = await query.populate('customer', 'name email phone');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('customer', 'name email phone');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Check if customer exists
    const customer = await Customer.findById(req.body.customer);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const payment = await Payment.create(req.body);

    // Emit payment received event via WebSocket
    req.io.emit('paymentReceived', {
      payment,
      customer,
      user: req.user
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    let payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    // Emit payment status updated event via WebSocket
    req.io.emit('paymentStatusUpdated', payment);

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mock payment API endpoint
// @route   POST /api/payments/mock
// @access  Private
exports.mockPayment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Randomly determine if payment succeeds (80% success rate)
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        error: 'Insufficient funds'
      });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};