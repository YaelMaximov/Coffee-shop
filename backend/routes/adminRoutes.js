// adminRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, checkAdmin } = require('../authMiddleware');
const menuOperations = require('../menuOperations'); 
const branchOperations = require('../branchOperations');

// Apply authentication and authorization middleware to all routes
router.use(authenticateToken);
router.use(checkAdmin);

// Admin operations

router.delete('/deleteDish/:dish_id', menuOperations.deleteDish);
router.put('/updateDish/:dish_id', menuOperations.updateDish);
router.put('/updateBranch/:branchId', async (req, res) => {
    try {
        await branchOperations.updateBranch(req.params.branchId, req.body);
        res.status(200).send('Branch updated successfully');
    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).send('Error updating branch: ' + error.message);
    }
});
router.get('getOrdersOfToday',async (req, res) => {
    try {
      const query = `
          SELECT * FROM Orders
          WHERE DATE(order_date) = CURDATE()
      `;
      const [rows] = await connection.query(query);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send('Error fetching orders');
    }
  });


// Ensure to include routes for getting and updating admins if needed
// e.g., router.get('/getAdmin/:manager_id', adminOperations.getAdminById);

module.exports = router;
