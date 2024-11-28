'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Créer la table Owner
    await queryInterface.createTable('Owner', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // Définit comme clé primaire
        autoIncrement: true, // L'ID s'auto-incrémente
        allowNull: false, // Ne peut pas être null
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Assurer que le nom soit obligatoire
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Supprimer la table Owner si la migration est annulée
    await queryInterface.dropTable('Owner');
  },
};
