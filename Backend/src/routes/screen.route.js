const express = require('express')
const ScreenRoutes = express.Router();
const ScreenController = require('../Controller/screen.controller');

ScreenRoutes.get('/reviews',ScreenController.getReviews);
ScreenRoutes.post('/reviews',ScreenController.postReviews);

module.exports = ScreenRoutes;