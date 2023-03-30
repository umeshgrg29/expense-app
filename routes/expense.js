const express = require('express');

const expenseController = require('../controllers/expense')
// const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense', expenseController.addexpense )

router.get('/getexpenses', expenseController.getexpenses )

router.delete('/deleteexpense/:expenseid', expenseController.deleteexpense)

module.exports = router;