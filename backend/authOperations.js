const connection = require('./db');

// Registration Logic
exports.register = async (req, res) => {
  const { first_name, last_name, gender, phone, email, birthdate, address_id } = req.body;

  try {
    // Check if the email or phone already exists
    const [existingMember] = await connection.query(
      'SELECT * FROM Members WHERE email = ? OR phone = ?',
      [email, phone]
    );

    if (existingMember.length > 0) {
      return res.status(400).json({ message: 'Email or phone number already in use.' });
    }

    // Insert new member into the database
    const [newMember] = await connection.query(
      'INSERT INTO Members (first_name, last_name, gender, phone, email, birthdate, address_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, gender, phone, email, birthdate, address_id]
    );

    res.status(201).json({ message: 'Registration successful', member: newMember });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
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
