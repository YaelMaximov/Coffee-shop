// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

// // Route for getting all dishes
// router.get('/getOrderMenu', orderController.getOrderMenu);

// routes/orderRoutes.js

router.post('/', (req, res) => {
    const { member_id, order_type, total_price, notes, order_date } = req.body;
    
    const query = `INSERT INTO orders (member_id, order_type, total_price, notes, order_date) VALUES (?, ?, ?, ?, ?)`;
    
    req.db.query(query, [member_id, order_type, total_price, notes, order_date], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ order_id: results.insertId });
    });
});

module.exports = router;



// // Route for getting order items for a specific order
// router.get('/orderItems/:orderId', orderController.getOrderItems);

module.exports = router;