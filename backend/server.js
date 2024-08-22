const express = require('express');
const app = express();
const port = 3009;
const cors = require('cors');

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const clubRoutes = require('./routes/orderRoutes');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Connect to the database
const connection = require('./db');
// Use the connection for the routes
app.use((req, res, next) => {
  req.db = connection; // This makes the 'connection' object accessible from the request object (req)
  next(); // Move on to the next middleware
});

// Use the routes

// app.use('/club', clubRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  