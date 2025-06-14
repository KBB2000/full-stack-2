const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');
const upload = require('../utils/fileUpload');

router.use(auth.protect);

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('outstandingAmount', 'Outstanding amount is required').isNumeric(),
    check('paymentDueDate', 'Payment due date is required').not().isEmpty()
  ],
  customerController.createCustomer
);

router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.get('/template/download', customerController.downloadTemplate);
router.post('/upload', upload.single('file'), customerController.uploadCustomers);

module.exports = router;