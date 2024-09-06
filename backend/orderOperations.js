const connection = require('./db');

// Create a new order
exports.createOrder = async (req, res) => {
  const { member_id, order_type, total_price, notes } = req.body;

  const query = `
    INSERT INTO Orders (member_id, order_type, total_price, notes, order_date)
    VALUES (?, ?, ?, ?, CURDATE())
  `;

  try {
    const [result] = await connection.query(query, [member_id, order_type, total_price, notes]);
    const orderId = result.insertId;
    res.status(200).json({ order_id: orderId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Add dishes to the order
exports.addOrderDishes = async (req, res) => {
    const { order_id, dishes } = req.body;
    
    // Log the received JSON payload
    console.log('Received order_id:', order_id);
    console.log('Received dishes:', dishes);

    try {
        const savedDishes = [];
        for (const dish of dishes) {
            // Ensure the dish.id is valid before inserting
            if (!dish.id) {
                console.error('Dish ID is missing or null for dish:', dish);
                continue;
            }

            const query = `
                INSERT INTO Order_Dishes (order_id, dish_id, quantity)
                VALUES (?, ?, ?)
            `;

            const result = await connection.query(query, [order_id, dish.id, dish.quantity]);
            savedDishes.push({
                order_dish_id: result.insertId,
                ...dish
            });
        }
        
        res.status(200).json({ message: 'Dishes added successfully', savedDishes });
    } catch (err) {
        console.error('Error adding dishes:', err);
        res.status(500).json({ message: 'Failed to add dishes' });
    }
};

// Add extras to a dish in the order
exports.addOrderDishExtras = async (req, res) => {
    const { order_dish_id, extras } = req.body;
  
    if (!extras || Object.keys(extras).length === 0) {
      return res.status(400).json({ message: 'No extras provided' });
    }
  
    try {
      // Iterate over each category in the extras object
      for (const category in extras) {
        if (Array.isArray(extras[category])) {
          // Iterate over each extra in the category
          for (const extra of extras[category]) {
            const getExtraIdQuery = `
              SELECT extra_id FROM Extras
              WHERE name = ? AND category = ?
            `;
  
            const [rows] = await connection.query(getExtraIdQuery, [extra.name, extra.category]);
  
            if (rows.length === 0) {
              console.error(`Extra not found for name: ${extra.name}, category: ${extra.category}`);
              return res.status(404).json({ message: `Extra not found: ${extra.name}` });
            }
  
            const extra_id = rows[0].extra_id; // Get the extra_id from the query result
  
            // Now insert the extra into Order_Dish_Extras with the retrieved extra_id
            const insertExtraQuery = `
              INSERT INTO Order_Dish_Extras (order_dish_id, extra_id)
              VALUES (?, ?)
            `;
            await connection.query(insertExtraQuery, [order_dish_id, extra_id]);
          }
        }
      }
  
      res.status(200).json({ message: 'Extras added successfully' });
    } catch (err) {
      console.error('Error adding extras:', err);
      res.status(500).json({ message: 'Failed to add extras' });
    }
  };
  
  
  

// Create a delivery order
exports.createDeliveryOrder = async (req, res) => {
  const { order_id, recipient_name, recipient_phone, address_id, payment_method } = req.body;

  const query = `
    INSERT INTO Delivery_Orders (order_id, recipient_name, recipient_phone, address_id, payment_method)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await connection.query(query, [order_id, recipient_name, recipient_phone, address_id, payment_method]);
    res.status(200).json({ message: 'Delivery order created successfully' });
  } catch (err) {
    console.error('Error creating delivery order:', err);
    res.status(500).json({ message: 'Failed to create delivery order' });
  }
};

// Create a pickup order
exports.createPickupOrder = async (req, res) => {
  const { order_id, payment_method } = req.body;

  const query = `
    INSERT INTO Pickup_Orders (order_id, payment_method)
    VALUES (?, ?)
  `;

  try {
    await connection.query(query, [order_id, payment_method]);
    res.status(200).json({ message: 'Pickup order created successfully' });
  } catch (err) {
    console.error('Error creating pickup order:', err);
    res.status(500).json({ message: 'Failed to create pickup order' });
  }
};

exports.createAddress = async (req, res) => {
    const { street, house_number, city, apartment, entrance, floor } = req.body;
  
    const query = `
      INSERT INTO Addresses (street, house_number, city, apartment, entrance, floor)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    try {
      // Use async/await with connection.query to ensure proper error handling and consistency
      const [result] = await connection.query(query, [street, house_number, city, apartment, entrance, floor]);
      const addressId = result.insertId; // Get the inserted ID
      res.status(200).json({ address_id: addressId });
    } catch (err) {
      console.error('Error inserting address:', err);
      res.status(500).json({ message: 'Failed to insert address' });
    }
  };
  