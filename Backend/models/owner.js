// models/owner.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Importation de la connexion à la base de données

const Owner = sequelize.define(
  "Owner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définit "id" comme clé primaire
      autoIncrement: true, // L'ID s'auto-incrémente
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Assurer que le nom soit obligatoire
    },
  },
  {
    tableName: "Owner", // Forcer l'utilisation de "Owner" comme nom de table exact
    timestamps: false,  // Désactiver les colonnes `createdAt` et `updatedAt`
  }
);

module.exports = Owner;
