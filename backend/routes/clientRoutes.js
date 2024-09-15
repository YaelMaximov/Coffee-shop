const express = require('express');
const router = express.Router();
const { authenticateToken, checkClient } = require('../authMiddleware');
const orderOperations = require('../operations/orderOperations');

// וידוא שהמשתמש מאומת ושהוא לקוח
router.use(authenticateToken);
router.use(checkClient);


router.get('/client', (req, res) => {
  res.send('Client-only content');
});
//Route for creating a new Address
//router.post('/createAddress', orderOperations.createAddress);

router.get('/customerOrder', orderOperations.getMyorder);

// Route for creating a new order
router.post('/save', orderOperations.createOrder);

// Route for adding dishes to an order
router.post('/saveDishes', orderOperations.addOrderDishes);

// Route for adding extras to a dish in an order
router.post('/addOrderDishExtras', orderOperations.addOrderDishExtras);

// Route for creating a delivery order
router.post('/saveDelivery', orderOperations.createDeliveryOrder);

// Route for creating a pickup order
router.post('/savePickup', orderOperations.createPickupOrder);


module.exports = router;
