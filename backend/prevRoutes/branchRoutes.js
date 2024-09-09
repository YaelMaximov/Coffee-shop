const express = require('express');
const router = express.Router();
const branchOperations = require('../operations/branchOperations');

// Route for getting branch details
router.get('/getBranch/:branch_id', branchOperations.getBranch);
router.get('/getAll', branchOperations.getAll);


//admin operation
router.put('/updateBranch/:branchId', async (req, res) => {
    try {
        await branchOperations.updateBranch(req.params.branchId, req.body);
        res.status(200).send('Branch updated successfully');
    } catch (error) {
        console.error('Error updating branch:', error);
        res.status(500).send('Error updating branch: ' + error.message);
    }
});
module.exports = router;
