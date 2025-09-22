const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');

// Define the API endpoint for generating a diet chart.
// When a POST request is made to '/api/user/dietchart',
// it will execute the 'generateDietChart' function in the controller.
router.post('/user/dietchart', dietController.generateDietChart);

module.exports = router;
