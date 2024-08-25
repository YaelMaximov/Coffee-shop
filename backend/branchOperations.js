const connection = require('./db');

exports.getBranch = async (req, res) => {
  try {
    const branchId = req.params.branch_id;
    const [results] = await connection.query('select * from branches where branch_id = 1', [branchId]);
    
    if (results.length === 0) {
      res.status(404).json({ error: 'Branch not found' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error('Error retrieving the branch details:', error);
    res.status(500).json({ error: 'Error retrieving the branch details' });
  }
};

// Endpoint to fetch all branches
// exports.getAll('/branches', async (req, res) => {
//   try {
//     const branches = await connection.query('SELECT * FROM branches');
//     res.json(branches.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });
