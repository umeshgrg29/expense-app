
const express = require('express');

const router = express.Router();

const usercontroller = require('../controllers/user')
const userauthentication = require('../middleware/auth')
const expenseController = require('../controllers/expense')


router.post('/signup', usercontroller.signup)

router.post('/login', usercontroller.login)

router.get('/download', userauthentication.authenticate, expenseController.downloadexpense)



module.exports = router;