const connection = require('../db');

// פונקציה שמחזירה פרטי מנהל לפי המזהה שלו
exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.manager_id;
    const [results] = await connection.query('SELECT * FROM Managers WHERE manager_id = ?', [adminId]);

    if (results.length === 0) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error('Error retrieving the admin details:', error);
    res.status(500).json({ error: 'Error retrieving the admin details' });
  }
};

// פונקציה שמחזירה את כל המנהלים
exports.getAllAdmins = async (req, res) => {
  try {
    const [admins] = await connection.query('SELECT * FROM Managers');
    res.json(admins);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send("Server error");
  }
};

// פונקציה לעדכון פרטי מנהל
exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.manager_id;
    const { username, password } = req.body;
    const [result] = await connection.query('UPDATE Managers SET username = ?, password = ? WHERE manager_id = ?', [username, password, adminId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json({ message: 'Admin updated successfully' });
    }
  } catch (error) {
    console.error('Error updating the admin details:', error);
    res.status(500).json({ error: 'Error updating the admin details' });
  }
};

// פונקציה למחיקת מנהל
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.manager_id;
    const [result] = await connection.query('DELETE FROM Managers WHERE manager_id = ?', [adminId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json({ message: 'Admin deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting the admin:', error);
    res.status(500).json({ error: 'Error deleting the admin' });
  }
};

exports.getOrdersForToday = async (req, res) => {
  try {
    const query = `
        SELECT * FROM Orders
        WHERE DATE(order_date) = CURDATE()
    `;
    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders');
  }
};


