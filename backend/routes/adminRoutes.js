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
router.get('/getOrdersOfToday', async (req, res) => {
    try {
      const query = `
          SELECT order_id, member_id, order_type, total_price, notes, order_date, order_time, status
          FROM Orders
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
// פונקציה לשליפת פרטי הזמנה, מנות, תוספות והערות
router.get('/orderDetails/:order_id', async (req, res) => {
    const { order_id } = req.params;
  
    try {
      // Query to retrieve order details and related dishes
      const orderQuery = `
          SELECT o.order_id, o.notes, o.total_price, o.order_date, o.order_time, o.status,
                 od.order_dish_id, od.dish_id, od.quantity, d.name AS dish_name, d.description, d.price AS dish_price, d.image_url AS dish_image
          FROM Orders o
          JOIN Order_Dishes od ON o.order_id = od.order_id
          JOIN Dishes d ON od.dish_id = d.dish_id
          WHERE o.order_id = ?
      `;
      const [orderDetails] = await connection.query(orderQuery, [order_id]);
  
      // Query to retrieve extras for the dishes in the order
      const extrasQuery = `
          SELECT odx.order_dish_id, e.name AS extra_name, e.price AS extra_price
          FROM Order_Dish_Extras odx
          JOIN Extras e ON odx.extra_id = e.extra_id
          JOIN Order_Dishes od ON odx.order_dish_id = od.order_dish_id
          WHERE od.order_id = ?
      `;
      const [extrasDetails] = await connection.query(extrasQuery, [order_id]);
  
      // Creating a data structure to aggregate data by dish
      const dishesMap = new Map();
  
      // Adding dish details to the data structure
      orderDetails.forEach(item => {
        if (!dishesMap.has(item.order_dish_id)) {
          dishesMap.set(item.order_dish_id, {
            dish_id: item.dish_id, // Ensure dish_id is included
            name: item.dish_name,
            description: item.description,
            price: item.dish_price,
            image_url: item.dish_image,
            quantity: item.quantity,
            extras: [] // Field for extras
          });
        }
      });
  
      // Adding extras to each dish in the data structure
      extrasDetails.forEach(extra => {
        if (dishesMap.has(extra.order_dish_id)) {
          dishesMap.get(extra.order_dish_id).extras.push({
            name: extra.extra_name,
            price: extra.extra_price
          });
        }
      });
  
      const response = {
        order_id: order_id,
        notes: orderDetails[0]?.notes || null, // General order notes
        total_price: orderDetails[0]?.total_price || 0,
        order_date: orderDetails[0]?.order_date || null,
        order_time: orderDetails[0]?.order_time || null, // Include order time
        status: orderDetails[0]?.status || 'לא מוכן', // Include order status
        dishes: Array.from(dishesMap.values()) // List of dishes with their extras
      };
      
      console.log(response); // Check the response structure
  
      res.json(response);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).send('Error fetching order details');
    }
  });
  

// Route to get customer details for a specific order
router.get('/orderCustomerDetails/:order_id', async (req, res) => {
    const { order_id } = req.params;
    console.log(order_id)

    try {
        // Query to retrieve customer details for the given order
        const query = `
            SELECT m.first_name, m.last_name, m.phone
            FROM Orders o
            LEFT JOIN Members m ON o.member_id = m.member_id
            WHERE o.order_id = ?
        `;
        const [rows] = await connection.query(query, [order_id]);
        console.log(rows[0])

        if (rows.length > 0) {
            res.json(rows[0]); // Assuming there's only one result per order
        } else {
            res.status(404).send('Customer details not found for the given order ID');
        }
    } catch (error) {
        console.error('Error fetching customer details:', error);
        res.status(500).send('Error fetching customer details');
    }
});





// Ensure to include routes for getting and updating admins if needed
// e.g., router.get('/getAdmin/:manager_id', adminOperations.getAdminById);

module.exports = router;
