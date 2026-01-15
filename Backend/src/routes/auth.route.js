const express = require('express')
const router = express.Router();
const authController = require('../Controller/auth.controller')

router.post('/Student/register', authController.registerstudents)
router.post('/Student/login',authController.loginstudents)
router.get('/Student/logout',authController.logoutstudent);

module.exports = router; 