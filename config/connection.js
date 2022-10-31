const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  //database name
  process.env.DB_NAME,
  //mysql username
  process.env.DB_USER,
  //mysql password
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
);

module.exports = sequelize;
