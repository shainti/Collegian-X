const express = require('express')
const router = express.Router();
const authController = require('../Controller/auth.controller')

router.post('/Student/register', authController.registerstudents)
router.post('/Student/login',authController.loginstudents)
router.post('/Faculty/login',authController.Facultylogin);
router.post('/Student/verify-email',authController.verifyMail);


module.exports = router; 