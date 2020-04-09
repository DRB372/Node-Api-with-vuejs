const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const activity = sequelize.define('activity', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  linkName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  topicID: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = activity;
