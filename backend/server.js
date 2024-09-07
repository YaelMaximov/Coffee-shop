const express = require('express');
const app = express();
const port = 3010;
const cors = require('cors');
const jwt=require("jsonwebtoken");
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authRoutes'); // Importing the auth routes
const publicRoutes = require('./routes/publicRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cookieParser());
const strictCorsOptions = {
  origin: 'http://localhost:3000', // ה-origin של הלקוח
  credentials: true, // מאפשר שליחת credentials (כגון cookies)
};

const openCorsOptions = {
  origin: '*', // מאפשר כל origin
};


app.use(express.json());

// השתמש ב-CORS לנתיבים עם הגדרות קפדניות
app.use('/auth', cors(strictCorsOptions), authRoutes); // נתיב עם CORS קפדני
app.use('/client', cors(strictCorsOptions), clientRoutes); // נתיב עם CORS קפדני

// השתמש ב-CORS פתוח לנתיבים ציבוריים
app.use('/public', cors(openCorsOptions), publicRoutes); // נתיב עם CORS פתוח

// השתמש ב-CORS עם קונפיגורציה כללית לנתיבים אחרים (כגון /admin)
app.use('/admin', cors(strictCorsOptions), adminRoutes); 





// Connect to the database
const connection = require('./db');

// Use the connection for the routes
app.use((req, res, next) => {
  req.db = connection; // This makes the 'connection' object accessible from the request object (req)
  next(); // Move on to the next middleware
});



// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
