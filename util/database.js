const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Umesh@123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
