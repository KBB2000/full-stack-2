const Customer = require('../models/Customer');
const logger = require('../config/logger');
const exceljs = require('exceljs');
const { validationResult } = require('express-validator');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Customer.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Customer.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const customers = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination,
      data: customers
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.createdBy = req.user.id;

    const customer = await Customer.create(req.body);

    // Emit new customer event via WebSocket
    req.io.emit('newCustomer', customer);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Make sure user is customer owner
    if (customer.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this customer' });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Make sure user is customer owner
    if (customer.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this customer' });
    }

    await customer.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Upload customers via Excel
// @route   POST /api/customers/upload
// @access  Private
exports.uploadCustomers = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel file' });
    }

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);

    const customers = [];
    const errors = [];
    
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const customerData = {
        name: row.getCell(1).value,
        email: row.getCell(2).value,
        phone: row.getCell(3).value,
        outstandingAmount: row.getCell(4).value,
        paymentDueDate: row.getCell(5).value,
        paymentStatus: row.getCell(6).value || 'pending',
        createdBy: req.user.id
      };

      // Validate data
      if (!customerData.name || !customerData.outstandingAmount || !customerData.paymentDueDate) {
        errors.push({
          row: rowNumber,
          message: 'Missing required fields in row'
        });
        return;
      }

      customers.push(customerData);
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors in Excel file',
        errors
      });
    }

    const createdCustomers = await Customer.insertMany(customers);

    // Emit new customers event via WebSocket
    req.io.emit('customersUploaded', createdCustomers);

    res.status(201).json({
      success: true,
      count: createdCustomers.length,
      data: createdCustomers
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Download Excel template
// @route   GET /api/customers/template
// @access  Private
exports.downloadTemplate = async (req, res, next) => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Customers');

    // Add headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Outstanding Amount', key: 'outstandingAmount', width: 20 },
      { header: 'Payment Due Date (YYYY-MM-DD)', key: 'paymentDueDate', width: 25 },
      { header: 'Payment Status (pending/paid/overdue/partial)', key: 'paymentStatus', width: 30 }
    ];

    // Add example row
    worksheet.addRow({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      outstandingAmount: 1000,
      paymentDueDate: '2023-12-31',
      paymentStatus: 'pending'
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=customers_template.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};