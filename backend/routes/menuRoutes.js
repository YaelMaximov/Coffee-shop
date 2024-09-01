// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuOperations = require('../menuOperations');


// Route for getting all dishes
router.get('/getMenu', menuOperations.getMenu);

router.get('/:dishId/extras', menuOperations.getDishExtras);

router.delete('/deleteDish/:dish_id', menuOperations.deleteDish);

// Route to update a dish
router.put('/updateDish/:dish_id', menuOperations.updateDish);

//// Route for getting all  categories
// router.get('/getMenuCategories', getMenuCategories);

//// Route for get dish extras
// router.get('/getDishExtras/:dish_id', getMenuCategories);

module.exports = router;