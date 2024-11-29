'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert some demo users into the 'Users' table
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@example.com',
        password_hash: 'hashed_password',  // Assure-toi d'utiliser un mot de passe haché !
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'owner@example.com',
        password_hash: 'hashed_password',
        role: 'owner',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'client@example.com',
        password_hash: 'hashed_password',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Si tu veux supprimer les utilisateurs insérés lors du rollback
    await queryInterface.bulkDelete('Users', null, {});
  }
};

