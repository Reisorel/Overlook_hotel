const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Importation de la connexion à la base de données

const Clients = sequelize.define(
  "Clients", // Nom du modèle
  {
    id: {
      type: DataTypes.INTEGER, // Type correspondant à la colonne SQL
      primaryKey: true, // Définit "id" comme clé primaire
      autoIncrement: true, // Indique que l'ID s'incrémente automatiquement
    },
    name: {
      type: DataTypes.STRING, // Correspond au type SQL "character varying"
      allowNull: true, // Permet les valeurs nulles
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATEONLY, // Date au format "YYYY-MM-DD"
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Clients", // Nom exact de la table dans la base de données
    timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt`
  }
);

module.exports = Clients; // Exporte le modèle pour utilisation ailleurs
