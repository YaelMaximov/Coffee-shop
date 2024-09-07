const connection = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const app = express();
const saltRounds = 10;

app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

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
    password // Add password to the request body
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Query to insert the member with the hashed password
    const query = `
      INSERT INTO Members (first_name, last_name, gender, phone, email, birthdate, address_id, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(query, [first_name, last_name, gender, phone, email, birthdate, address_id, hashedPassword]);
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error inserting member:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// JWT Secret should be stored in an environment variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_EXPIRATION = '1h'; // 1 hour for access token
const JWT_REFRESH_EXPIRATION = '30d'; // 30 days for refresh token

// Login Logic
exports.login = async (req, res) => {
  console.log("login")
  const { email, password } = req.body;
  if (!email || !password){
    return res.status(400).json({message: 'All fields are required'})
  }

  try {
    const [customers] = await connection.query('SELECT * FROM Members WHERE email = ?', [email]);
    const customer = customers[0];

    if (!customer) {
      return res.status(400).json({ message: 'Email not found.' });
    }

    const isMatch = await bcrypt.compare(password, customer.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const payload = {
      userId: customer.id,
      email: customer.email,
      role: 'customer'
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

 
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax', // אפשר לנסות להגדיר כך לצורך בדיקה
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

   

    res.status(200).json({
      message: 'Login successful',
      role: 'customer',
      accessToken,
      userId: customer.member_id,
      username: customer.first_name + " " + customer.last_name
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [managers] = await connection.query('SELECT * FROM Managers WHERE username = ?', [username]);
    const manager = managers[0];

    if (!manager) {
      return res.status(400).json({ message: 'Username not found.' });
    }

    // Compare plaintext password
    const isMatch = password === manager.password;

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Create JWT payload
    const payload = {
      userId: manager.manager_id,
      username: manager.username,
      role: 'admin'
    };

    // Generate access and refresh tokens
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: JWT_EXPIRATION });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

    // Set refresh token as HTTP-only cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax', // אפשר לנסות להגדיר כך לצורך בדיקה
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      message: 'Login successful',
      role: 'admin',
      accessToken,
      userId: manager.manager_id,
      username: manager.username
    });
  } catch (error) {
    console.error('Error during admin login:', error.message);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

exports.logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(204).json({ message: 'No cookie to clear' }); // שלח תשובה חיובית אם אין קוקי
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax', // אפשר לנסות להגדיר כך לצורך בדיקה
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  });

  res.status(200).json({ message: 'Cookie cleared' }); // שלח תשובה חיובית אם הקוקי נמחק
};

exports.refreshToken = async (req, res) => {
  console.log("refreshToken");

  const cookies = req.cookies;
  // console.log('Cookies:', cookies);

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decode) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    console.log('Decoded JWT:', decode);

    try {
      if (decode.role === 'customer') {
        const [customer] = await connection.query('SELECT * FROM Members WHERE email = ?', [decode.email]);
        if (!customer[0]) return res.status(401).json({ message: 'Unauthorized' });

        const newAccessToken = jwt.sign(
          { userId: decode.userId, email: decode.email, role: decode.role },
          ACCESS_TOKEN_SECRET,
          { expiresIn: JWT_EXPIRATION }
        );

        return res.json({ accessToken: newAccessToken });
      } else if (decode.role === 'admin') {
        const [manager] = await connection.query('SELECT * FROM Managers WHERE username = ?', [decode.username]);
        if (!manager[0]) return res.status(401).json({ message: 'Unauthorized' });

        const newAccessToken = jwt.sign(
          { userId: decode.userId, email: decode.username, role: decode.role },
          ACCESS_TOKEN_SECRET,
          { expiresIn: JWT_EXPIRATION }
        );

        return res.json({ accessToken: newAccessToken });
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      return res.status(500).json({ message: 'Server error during token refresh.' });
    }
  });
};


