'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rooms', [
      {
        name: 'Blue Wave',
        type: 'Single',
        price: 120,
        available: true,
        description: 'A tranquil room with a view of the ocean.',
        capacity: 1,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Coral Reef',
        type: 'Double',
        price: 200,
        available: true,
        description: 'A room with a vibrant, coral-inspired interior.',
        capacity: 2,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Deep Sea',
        type: 'Suite',
        price: 350,
        available: true,
        description: 'An elegant suite with a deep blue color scheme.',
        capacity: 4,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Tidal Pool',
        type: 'Single',
        price: 130,
        available: true,
        description: 'A small yet cozy room with oceanic decor.',
        capacity: 1,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Sea Breeze',
        type: 'Double',
        price: 180,
        available: true,
        description: 'A fresh room with a breezy, sea-themed ambiance.',
        capacity: 2,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Sunset Bay',
        type: 'Suite',
        price: 400,
        available: true,
        description: 'A luxury suite with an ocean view and sunset views.',
        capacity: 4,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Shark Cove',
        type: 'Single',
        price: 150,
        available: true,
        description: 'A sleek, modern room with shark-inspired design.',
        capacity: 1,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Pearl Lagoon',
        type: 'Double',
        price: 220,
        available: true,
        description: 'A room that captures the elegance of a tranquil lagoon.',
        capacity: 2,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Wavesong',
        type: 'Single',
        price: 110,
        available: true,
        description: 'A peaceful room inspired by the sound of ocean waves.',
        capacity: 1,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Ocean Mist',
        type: 'Suite',
        price: 350,
        available: true,
        description: 'A spacious suite with soft misty tones and ocean views.',
        capacity: 4,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Seafoam Retreat',
        type: 'Double',
        price: 180,
        available: true,
        description: 'A cozy double room with gentle seafoam colors.',
        capacity: 2,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
      {
        name: 'Tsunami Room',
        type: 'Single',
        price: 170,
        available: true,
        description: 'A powerful room with waves of energy and design.',
        capacity: 1,
        id_owner: 24,  // Référence au propriétaire avec id 24
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rooms', null, {});
  }
};

