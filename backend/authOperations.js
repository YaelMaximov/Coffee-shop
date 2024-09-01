const connection = require('./db');

// Endpoint to save the address
exports.address = async (req, res) => {
  const { street, house_number, city, apartment, entrance, floor } = req.body;

  const query = `
    INSERT INTO Addresses (street, house_number, city, apartment, entrance, floor)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [street, house_number, city, apartment, entrance, floor]);
    const addressId = result.insertId;
    res.status(200).json({ address_id: addressId });
  } catch (err) {
    console.error('Error inserting address:', err);
    res.status(500).json({ message: 'Failed to save address' });
  }
};

// Endpoint to save the member with the address_id
exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    phone,
    email,
    birthdate,
    address_id,
  } = req.body;

  const query = `
    INSERT INTO Members (first_name, last_name, gender, phone, email, birthdate, address_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(query, [first_name, last_name, gender, phone, email, birthdate, address_id]);
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error inserting member:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Login Logic
exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists
    const [member] = await connection.query('SELECT * FROM Members WHERE email = ?', [email]);

    if (member.length === 0) {
      return res.status(400).json({ message: 'Email not found.' });
    }

    res.status(200).json({ message: 'Login successful', member: member[0] });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Admin Login Logic
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists
    const [manager] = await connection.query('SELECT * FROM Managers WHERE username = ?', [username]);

    if (manager.length === 0) {
      return res.status(400).json({ message: 'Username not found.' });
    }

    // Check if the password is correct (no encryption)
    if (password !== manager[0].password) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    res.status(200).json({ message: 'Login successful', manager: manager[0] });
  } catch (error) {
    console.error('Error during admin login:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

