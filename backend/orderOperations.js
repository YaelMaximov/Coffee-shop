const connection = require('./db');

// Create a new order
// Create a new order
exports.createOrder = async (req, res) => {
  const { member_id, order_type, total_price, notes, customer_name, customer_phone } = req.body;
  console.log("customer",customer_name, customer_phone)
  const query = `
    INSERT INTO Orders (member_id, order_type, total_price, notes, order_date, order_time, status, customer_name, customer_phone)
    VALUES (?, ?, ?, ?, CURDATE(), NOW(), 'לא מוכן', ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [member_id, order_type, total_price, notes, customer_name, customer_phone]);
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

            const insertQuery = `
                INSERT INTO Order_Dishes (order_id, dish_id, quantity)
                VALUES (?, ?, ?)
            `;

            const result = await connection.query(insertQuery, [order_id, dish.id, dish.quantity]);
            const insertId =  result[0].insertId;  // גישה ל-insertId
            console.log('Insert result:', insertId);

            savedDishes.push({
                order_dish_id: insertId,
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
  const { order_dish_id, extras,category } = req.body;
  console.log('Received order_dish_id:', order_dish_id);
  console.log('Received extras:', JSON.stringify(extras, null, 2));

  if (!extras || !Array.isArray(extras) || extras.length === 0) {
    console.error('No valid extras provided');
    return res.status(400).json({ message: 'No valid extras provided' });
  }

  try {
    console.log('Processing extras...');

    for (const extra of extras) {
      console.log(`Processing extra: ${extra.name}, category: ${category}`);

      if (!extra.name || !extra.category) {
        console.error(`Invalid extra format: ${extra}`);
        continue;
      }

      const getExtraIdQuery = `
        SELECT extra_id FROM Extras
        WHERE name = ? AND category = ?
      `;

      const [rows] = await connection.query(getExtraIdQuery, [extra.name, category]);

      if (rows.length === 0) {
        console.error(`Extra not found for name: ${extra.name}, category: ${category}`);
        continue;
      }

      const extra_id = rows[0].extra_id;
      console.log(`Found extra_id: ${extra_id} for extra: ${extra.name}, category: ${category}`);

      const insertExtraQuery = `
        INSERT INTO Order_Dish_Extras (order_dish_id, extra_id)
        VALUES (?, ?)
      `;

      const insertResult = await connection.query(insertExtraQuery, [order_dish_id, extra_id]);
      console.log(`Inserted extra for order_dish_id: ${order_dish_id}, extra_id: ${extra_id}, result:`, insertResult);
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

  // שאילתה לבדוק אם הכתובת כבר קיימת בטבלה, כולל טיפול בערכים ריקים ו-null
  const checkQuery = `
    SELECT address_id FROM Addresses
    WHERE street = ? AND house_number = ? AND city = ?
    AND (apartment = ?)
    AND (entrance = ?)
    AND (floor = ?)
  `;

  const insertQuery = `
    INSERT INTO Addresses (street, house_number, city, apartment, entrance, floor)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    // בדוק אם הכתובת כבר קיימת
    const [existingAddress] = await connection.query(checkQuery, [
      street, 
      house_number, 
      city, 
      apartment, 
      entrance, 
       floor
    ]);

    if (existingAddress.length > 0) {
      // אם הכתובת קיימת, נחזיר את ה-ID שלה
      const addressId = existingAddress[0].address_id;
      res.status(200).json({message:"the address exist", address_id: addressId });
    } else {
      // אם הכתובת לא קיימת, נכניס אותה לטבלה
      const [result] = await connection.query(insertQuery, [
        street, 
        house_number, 
        city, 
        apartment || null, 
        entrance || null, 
        floor || null
      ]);
      const addressId = result.insertId; // קבלת ה-ID שנוצר
      res.status(200).json({ address_id: addressId });
    }
  } catch (err) {
    console.error('Error inserting address:', err);
    res.status(500).json({ message: 'Failed to insert address' });
  }
};



exports.getMyorder = async (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM Orders WHERE member_id = ?`;

  try {
    const [orders] = await connection.query(query, [user_id]);
    if (orders.length === 0) {
      // החזרת תשובה עם קוד סטטוס 200 עם הודעה שציינה שאין הזמנות
      return res.status(200).json({ message: 'No orders found', orders: [] });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};
