const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'other'],
    default: 'bank_transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update customer's outstanding amount when payment is saved
PaymentSchema.pre('save', async function(next) {
  if (this.isNew) {
    const customer = await this.model('Customer').findById(this.customer);
    if (customer) {
      customer.outstandingAmount -= this.amount;
      
      // Update payment status if fully paid
      if (customer.outstandingAmount <= 0) {
        customer.paymentStatus = 'paid';
      } else if (this.amount > 0) {
        customer.paymentStatus = 'partial';
      }
      
      await customer.save();
    }
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);