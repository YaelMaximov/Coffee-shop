const connection = require('./db');

exports.getMenu= async (req, res) => {
    try {
      const [results] = await connection.query('SELECT * FROM Dishes');
      res.json(results);
    } catch (error) {
      console.error('Error retrieving the menu:', error);
      res.status(500).json({ error: 'Error retrieving the menu' });
    }
  };
  





// exports.getMenuCategories
// exports.getMenuCategories