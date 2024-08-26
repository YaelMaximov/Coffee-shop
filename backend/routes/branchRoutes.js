const express = require('express');
const router = express.Router();
const branchOperations = require('../branchOperations');

// Route for getting branch details
router.get('/getBranch/:branch_id', branchOperations.getBranch);
router.get('/getAll', branchOperations.getAll);

module.exports = router;
