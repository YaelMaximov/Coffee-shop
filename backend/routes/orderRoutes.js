const express = require('express');
const router = express.Router();
const orderOperations = require('../orderOperations'); // נוסיף את הפעולות שקשורות להזמנה

//Route for creating a new Address
router.post('/createAddress', orderOperations.createAddress);

// Route for creating a new order
router.post('/save', orderOperations.createOrder);

// Route for adding dishes to an order
router.post('/saveDishes', orderOperations.addOrderDishes);

// Route for adding extras to a dish in an order
router.post('/addDishExtras', orderOperations.addOrderDishExtras);

// Route for creating a delivery order
router.post('/saveDelivery', orderOperations.createDeliveryOrder);

// Route for creating a pickup order
router.post('/savePickup', orderOperations.createPickupOrder);

module.exports = router;
