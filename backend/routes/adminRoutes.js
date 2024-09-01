const express = require('express');
const router = express.Router();
const adminOperations = require('../adminOperations');
const menuOperations = require('../menuOperations');

router.delete('/dishes/:dish_id', menuOperations.deleteDish);
router.put('/dishes/:dish_id', menuOperations.updateDish);

// Route to get details of a specific admin
router.get('/getAdmin/:manager_id', adminOperations.getAdminById);

// Route to get all admins
router.get('/getAllAdmins', adminOperations.getAllAdmins);

// Route to update an admin's details
router.put('/updateAdmin/:manager_id', adminOperations.updateAdmin);

// Route to delete an admin
router.delete('/deleteAdmin/:manager_id', adminOperations.deleteAdmin);

router.get('/orders', adminOperations.getOrdersForToday);


module.exports = router;
