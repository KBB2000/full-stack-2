const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.use(auth.protect);

router.get('/', paymentController.getPayments);
router.get('/:id', paymentController.getPayment);
router.get('/customer/:customerId', paymentController.getPayments);

router.post(
  '/',
  [
    check('customer', 'Customer ID is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric()
  ],
  paymentController.createPayment
);

router.put(
  '/:id/status',
  [
    check('status', 'Status is required').not().isEmpty()
  ],
  paymentController.updatePaymentStatus
);

router.post(
  '/mock',
  [
    check('amount', 'Amount is required').isNumeric(),
    check('cardNumber', 'Card number is required').not().isEmpty(),
    check('expiry', 'Expiry is required').not().isEmpty(),
    check('cvc', 'CVC is required').not().isEmpty()
  ],
  paymentController.mockPayment
);

module.exports = router;