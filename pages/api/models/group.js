const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//Definição em sequelize da tabela Group
const Group = sequelize.define('Group',
  {
    id_group: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name_group: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    desc_group: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    timestamps: true
  }
);

module.exports = Group;