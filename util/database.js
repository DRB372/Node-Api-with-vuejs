const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeapi', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
// database name: nodeapi 
// localhost: root 
// password: null