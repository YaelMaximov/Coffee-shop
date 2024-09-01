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

  exports.updateDish = async (req, res) => {
    const dishId = req.params.dish_id;
    const { name, price, description, category } = req.body;
  
    if (isNaN(dishId)) {
      return res.status(400).json({ error: 'Invalid dish ID' });
    }
  
    try {
      const [result] = await connection.query(
        'UPDATE dishes SET name = ?, price = ?, description = ?, category = ? WHERE dish_id = ?',
        [name, price, description, category, dishId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Dish not found' });
      }
  
      res.json({ message: 'Dish updated successfully' });
    } catch (error) {
      console.error('Error updating dish:', error);
      res.status(500).json({ error: 'Error updating dish' });
    }
  };
  

exports.deleteDish = async (req, res) => {
  const dishId = req.params.dish_id;

  if (isNaN(dishId)) {
    return res.status(400).json({ error: 'Invalid dish ID' });
  }

  try {
    await connection.query('START TRANSACTION');

    // First, delete related rows in dish_extra_categories
    await connection.query('DELETE FROM dish_extra_categories WHERE dish_id = ?', [dishId]);

    // Then, delete the dish itself
    const [result] = await connection.query('DELETE FROM dishes WHERE dish_id = ?', [dishId]);

    if (result.affectedRows === 0) {
      await connection.query('ROLLBACK');
      return res.status(404).json({ error: 'Dish not found' });
    }

    await connection.query('COMMIT');
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    await connection.query('ROLLBACK');
    res.status(500).json({ error: 'Error deleting dish' });
  }
};







// exports.getMenuCategories
// exports.getMenuCategories