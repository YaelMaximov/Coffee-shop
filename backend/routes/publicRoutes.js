// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const menuOperations = require('../operations/menuOperations'); 
const branchOperations = require('../operations/branchOperations'); 
const orderOperations = require('../operations/orderOperations');

// נתיבים ציבוריים
router.get('/public', (req, res) => {
  res.send('Public content');
});

// נתיב לפעולה ציבורית לקבלת התפריט

//'http://localhost:3010/public/getMenu'
router.get('/getMenu', menuOperations.getMenu);

//`http://localhost:3010/public/getBranch/${branchId}`
router.get('/getBranch/:branch_id', branchOperations.getBranch);

//'http://localhost:3010/public/getAllBranches'
router.get('/getAllBranches', branchOperations.getAll);

router.post('/createAddress', orderOperations.createAddress);




/**

`http://localhost:3010/public/${dishId}/extras`
 
 */
router.get('/:dishId/extras', menuOperations.getDishExtras);

module.exports = router;
