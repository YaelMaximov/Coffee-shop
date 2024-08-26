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



  
  exports.getDishExtras = async (req, res) => {
    const dishId = parseInt(req.params.dishId, 10);
  
    const query = `
      SELECT e.name, e.category, e.price,e.max_quantity
      FROM Extras e
      JOIN Dish_Extra_Categories d
      ON e.category = d.extra_category
      WHERE d.dish_id = ?
    `;
  
    try {
      const [results] = await connection.execute(query, [dishId]);
      res.json(results);
    } catch (error) {
      console.error('Error fetching extras:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };





// exports.getMenuCategories
// exports.getMenuCategories