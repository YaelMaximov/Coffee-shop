const connection = require('../db');


exports.getOrdersForToday = async (req, res) => {
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
};




