'use strict';

const Sequelize = require('sequelize');
const psqlCon = require('../connectors/psql');

const Spending = psqlCon.sequelize.define('spending', {
  // attributes
  id: { type: Sequelize.STRING, primaryKey: true },
  user_id: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  nominal: { type: Sequelize.INTEGER },

  created_date: { type: Sequelize.DATE },
  updated_date: { type: Sequelize.DATE },
}, {
  freezeTableName: true,
  tableName: 'spending',
  createdAt: false,
  updatedAt: false,
});


module.exports = {
  Spending
};

