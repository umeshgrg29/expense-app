const Sequelize = require('sequelize');

const sequelize = new Sequelize('Expense', 'root', 'Umesh@123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
