const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Importation de la connexion à la base de données

const Rooms = sequelize.define(
  "Rooms", // Nom du modèle
  {
    id: {
      type: DataTypes.INTEGER, // Type correspondant à la colonne SQL
      primaryKey: true, // Définit "id" comme clé primaire
      autoIncrement: true, // Indique que l'ID s'incrémente automatiquement
      allowNull: false, // Ne permet pas les valeurs nulles
    },
    name: {
      type: DataTypes.STRING, // Correspond au type SQL "character varying"
      allowNull: false, // Ne permet pas les valeurs nulles
    },
    type: {
      type: DataTypes.STRING, // Correspond au type SQL "character varying"
      allowNull: true, // Permet les valeurs nulles
    },
    price: {
      type: DataTypes.INTEGER, // Correspond au type SQL "integer"
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN, // Correspond au type SQL "boolean"
      allowNull: true,
      defaultValue: true, // Valeur par défaut
    },
    description: {
      type: DataTypes.STRING, // Correspond au type SQL "character varying"
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER, // Correspond au type SQL "integer"
      allowNull: true,
    },
    id_owner: {
      type: DataTypes.INTEGER, // Correspond au type SQL "integer"
      allowNull: true,
      references: {
        model: "Owner", // Nom de la table liée
        key: "id", // Clé étrangère référencée
      },
      onUpdate: "CASCADE", // Action lors d'une mise à jour
      onDelete: "SET NULL", // Action lors d'une suppression
    },
  },
  {
    tableName: "Rooms", // Nom exact de la table dans la base de données
    timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt`
    indexes: [
      {
        unique: true,
        fields: ["id"], // Index unique sur la colonne `id`
      },
    ],
  }
);

module.exports = Rooms; // Exporte le modèle pour utilisation ailleurs
