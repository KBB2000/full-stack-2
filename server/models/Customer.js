const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  outstandingAmount: {
    type: Number,
    required: [true, 'Please add an outstanding amount'],
    min: [0, 'Outstanding amount cannot be negative']
  },
  paymentDueDate: {
    type: Date,
    required: [true, 'Please add a payment due date']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'partial'],
    default: 'pending'
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with payments
CustomerSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'customer',
  justOne: false
});

module.exports = mongoose.model('Customer', CustomerSchema);