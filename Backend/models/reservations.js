const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Importation de la connexion à la base de données

const Reservations = sequelize.define(
  "Reservations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définit "id" comme clé primaire
      autoIncrement: true, // L'ID s'auto-incrémente
    },
    check_in: {
      type: DataTypes.DATEONLY, // Utilisation de DATEONLY pour une date sans heure
      allowNull: false, // La date d'arrivée est obligatoire
    },
    check_out: {
      type: DataTypes.DATEONLY, // Utilisation de DATEONLY pour une date sans heure
      allowNull: false, // La date de départ est obligatoire
    },
    id_rooms: {
      type: DataTypes.INTEGER,
      allowNull: false, // La chambre associée est obligatoire
    },
    id_clients: {
      type: DataTypes.INTEGER,
      allowNull: false, // Le client associé est obligatoire
    },
    number_of_people: {
      type: DataTypes.INTEGER,
      allowNull: false, // Le nombre de personnes est obligatoire
    },
  },
  {
    tableName: "Reservations", // Forcer l'utilisation de "Reservations" comme nom de table exact
    timestamps: false, // Désactiver les colonnes `createdAt` et `updatedAt`
  }
);

module.exports = Reservations;
