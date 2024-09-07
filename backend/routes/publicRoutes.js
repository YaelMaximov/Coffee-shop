// routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const menuOperations = require('../menuOperations'); 
const branchOperations = require('../branchOperations'); 

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




/**

`http://localhost:3010/public/${dishId}/extras`
 
 */
router.get('/:dishId/extras', menuOperations.getDishExtras);

module.exports = router;
