const path = require('path');

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');

const userRoutes = require('./routes/user') 
const expenseRoutes = require('./routes/expense')

const app = express();

app.use(cors())
app.use(express.json()); 

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);


sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
