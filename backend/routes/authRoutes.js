const express = require('express');
const router = express.Router();
const authOperations = require('../authOperations');
const { authenticateToken, checkAdmin, checkClient } = require('../authMiddleware');

// Route for registration
router.post('/register', authOperations.register);

// Route for login
router.post('/login', authOperations.login);
router.post('/admin-login', authOperations.adminLogin);

router.post('/address',authOperations.address)

router.post('/refresh-token',authOperations.refreshToken)

// Define the /auth/validate-token route
router.post('/validate-token', authenticateToken, (req, res) => {
    if (req.user) {
      // Return user info if token is valid
      res.json({ role: req.user.role });
    } else {
      res.sendStatus(401); // Unauthorized if no user info
    }
  });

router.post('/logout',authOperations.logout)

module.exports = router;
