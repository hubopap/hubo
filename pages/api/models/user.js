const { DataTypes } = require('sequelize');
const sequelize = require('../db');

//Definição em sequelize da tabela User
const User = sequelize.define('User', 
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    bio_user: {
      type: DataTypes.STRING(255),
      allowNull: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
    email_user: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    timestamps: true
  }
);

module.exports = User;