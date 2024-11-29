const { Client } = require('../models');  // Importation du modèle

module.exports = {
  async up(queryInterface, Sequelize) {
    await Client.bulkCreate([
      {
        email: 'test_client@example.com',
        password_hash: 'hashed_password',
        role: 'client',
      },
      {
        email: 'another_client@example.com',
        password_hash: 'hashed_password',
        role: 'client',
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Client.destroy({ where: {} });  // Supprimer tous les clients
  }
};

