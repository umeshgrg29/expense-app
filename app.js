const path = require('path');
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')

const express = require('express');
var cors = require('cors')
const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');

const userRoutes = require('./routes/user') 
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')


const app = express();


const dotenv = require('dotenv');

dotenv.config();

app.use(cors())
app.use(express.json()); 

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password', resetPasswordRoutes);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));
app.use(helmet())

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        // console.log(result);
        // console.log(process.env.PORT || 3000)
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });
