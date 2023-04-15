const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//Definição em sequelize da tabela Task
const Task = sequelize.define('Task', {
  id_task: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  desc_task: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deadline_task: {
    type: DataTypes.DATE,
    allowNull: false
  },
  state_task: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Task;