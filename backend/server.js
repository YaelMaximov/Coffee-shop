const express = require('express');
const app = express();
const port = 3010;
const cors = require('cors');
const jwt=require("jsonwebtoken");
const bodyParser = require('body-parser');


const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const branchRoutes = require('./routes/branchRoutes');
const authRoutes = require('./routes/authRoutes'); // Importing the auth routes
const adminRoutes = require('./routes/adminRoutes');

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());

// Connect to the database
const connection = require('./db');

// Use the connection for the routes
app.use((req, res, next) => {
  req.db = connection; // This makes the 'connection' object accessible from the request object (req)
  next(); // Move on to the next middleware
});

// Use the routes
app.use('/menu', menuRoutes);
app.use('/order', orderRoutes);
app.use('/branch', branchRoutes);
app.use('/auth', authRoutes); // Register the auth routes
app.use('/admin', adminRoutes);
//app.use('/admin/menu', menuRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
