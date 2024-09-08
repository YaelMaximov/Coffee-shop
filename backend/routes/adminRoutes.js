// adminRoutes.js
const express = require('express');
const connection = require('../db');
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
router.get('/getOrdersOfToday',async (req, res) => {
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

  // פונקציה לשליפת פרטי הזמנה, מנות, תוספות והערות
  router.get('/orderDetails/:order_id', async (req, res) => {
    const { order_id } = req.params;

    try {
        // שאילתא לשליפת פרטי ההזמנה והמנות הקשורות אליה
        const orderQuery = `
            SELECT o.order_id, o.notes, o.total_price, o.order_date,
                   od.quantity, d.name AS dish_name, d.description, d.price AS dish_price, d.image_url AS dish_image
            FROM Orders o
            JOIN Order_Dishes od ON o.order_id = od.order_id
            JOIN Dishes d ON od.dish_id = d.dish_id
            WHERE o.order_id = ?
        `;
        const [orderDetails] = await connection.query(orderQuery, [order_id]);

        // שאילתא לשליפת תוספות למנות בהזמנה
        const extrasQuery = `
            SELECT odx.order_dish_id, e.name AS extra_name, e.price AS extra_price
            FROM Order_Dish_Extras odx
            JOIN Extras e ON odx.extra_id = e.extra_id
            JOIN Order_Dishes od ON odx.order_dish_id = od.order_dish_id
            WHERE od.order_id = ?
        `;
        const [extrasDetails] = await connection.query(extrasQuery, [order_id]);

        // איחוד של פרטי ההזמנה עם התוספות שלה
        const response = {
            orderDetails: orderDetails,
            extrasDetails: extrasDetails
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Error fetching order details');
    }
});



// Ensure to include routes for getting and updating admins if needed
// e.g., router.get('/getAdmin/:manager_id', adminOperations.getAdminById);

module.exports = router;
