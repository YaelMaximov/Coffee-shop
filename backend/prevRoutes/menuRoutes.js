// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const menuOperations = require('../operations/menuOperations');


// Route for getting all dishes
router.get('/getMenu', menuOperations.getMenu);

router.get('/:dishId/extras', menuOperations.getDishExtras);



//admin operations

router.delete('/deleteDish/:dish_id', menuOperations.deleteDish);

// Route to update a dish
router.put('/updateDish/:dish_id', menuOperations.updateDish);


module.exports = router;