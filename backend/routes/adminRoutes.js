// adminRoutes.js
const express = require('express');
const connection = require('../db');
const router = express.Router();
const { authenticateToken, checkAdmin } = require('../authMiddleware');
const menuOperations = require('../operations/menuOperations'); 
const branchOperations = require('../operations/branchOperations');
const adminOperations = require('../operations/adminOperations');

// Apply authentication and authorization middleware to all routes
router.use(authenticateToken);
router.use(checkAdmin);

// Admin operations

router.delete('/deleteDish/:dish_id', menuOperations.deleteDish);
router.put('/updateDish/:dish_id', menuOperations.updateDish);

router.put('/updateBranch/:branchId', adminOperations.updateBranch);

router.get('/getOrdersOfToday',adminOperations.getOrdersOfToday);

router.get('/orderDetails/:order_id', adminOperations.orderDetails);

router.put('/updateOrderStatus/:order_id', adminOperations.updateOrderStatus);
  



module.exports = router;
