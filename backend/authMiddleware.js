const jwt = require('jsonwebtoken');

// Middleware to check if user is authenticated
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (token == null) return res.sendStatus(401); // If no token, unauthorized

  try {
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
    console.log("Decoded user ID:", user.userId);  // Ensure this prints correctly
    
    req.user = user; // Attach user info to request object
    next(); // Proceed to next middleware or route
  } catch (err) {
    console.error('Token verification failed:', err);
    res.sendStatus(403); // If token is invalid, forbidden
  }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed to next middleware or route
  } else {
    res.sendStatus(403); // Forbidden
  }
};

// Middleware to check if user is client
const checkClient = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    next(); // User is client, proceed to next middleware or route
  } else {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = { authenticateToken, checkAdmin, checkClient };
