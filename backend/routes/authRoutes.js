const express = require('express');
const router = express.Router();
const authOperations = require('../authOperations');

// Route for registration
router.post('/register', authOperations.register);

// Route for login
router.post('/login', authOperations.login);
router.post('/admin-login', authOperations.adminLogin);

router.post('/address',authOperations.address)

module.exports = router;
