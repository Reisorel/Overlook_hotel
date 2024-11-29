const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Importation de la connexion à la base de données

const Users = sequelize.define(
  "Users",
  {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "owner", "client"),
    allowNull: false,
  },
});

module.exports = Users;
