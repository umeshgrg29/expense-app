
const express = require('express');

const router = express.Router();

const usercontroller = require('../controllers/user')


router.post('/signup', usercontroller.signup)

router.post('/login', usercontroller.login)



module.exports = router;