const path = require('path');

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');

const userRoutes = require('./routes/user') 
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')

const app = express();

app.use(cors())
app.use(express.json()); 

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
