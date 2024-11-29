'use strict';

module.exports = {
  // Méthode exécutée lors de l'application de la migration
  up: async (queryInterface, Sequelize) => {
    // 1. Crée la table "Users"
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER, // Type INTEGER (entier)
        autoIncrement: true, // Valeur auto-incrémentée
        primaryKey: true, // Définit cette colonne comme clé primaire
        allowNull: false, // Ne peut pas être NULL
      },
      email: {
        type: Sequelize.STRING, // Type VARCHAR
        unique: true, // Contraint l'unicité (chaque email doit être unique)
        allowNull: false, // Ne peut pas être NULL
      },
      password_hash: {
        type: Sequelize.STRING, // Stocke le mot de passe haché
        allowNull: false, // Ne peut pas être NULL
      },
      role: {
        type: Sequelize.ENUM('admin', 'owner', 'client'), // Liste des valeurs possibles pour le rôle
        allowNull: false, // Ne peut pas être NULL
      },
      createdAt: {
        allowNull: false, // Ne peut pas être NULL
        type: Sequelize.DATE, // Type DATE pour stocker l'heure exacte
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Valeur par défaut : l'heure actuelle
      },
      updatedAt: {
        allowNull: false, // Ne peut pas être NULL
        type: Sequelize.DATE, // Type DATE pour les mises à jour
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Valeur par défaut : l'heure actuelle
      },
    });

    // 2. Ajoute une colonne "user_id" à la table "Owner"
    await queryInterface.addColumn('Owner', 'user_id', {
      type: Sequelize.INTEGER, // Type INTEGER
      allowNull: true, // Permet NULL temporairement pour éviter des conflits avec des données existantes
      references: {
        model: 'Users', // Nom de la table cible
        key: 'id', // Clé primaire de la table cible
      },
      onUpdate: 'CASCADE', // Met à jour "Owner.user_id" si "Users.id" change
      onDelete: 'SET NULL', // Définit "user_id" à NULL si l'utilisateur est supprimé
    });

    // 3. Ajoute une colonne "user_id" à la table "Clients"
    await queryInterface.addColumn('Clients', 'user_id', {
      type: Sequelize.INTEGER, // Type INTEGER
      allowNull: true, // Permet NULL temporairement pour éviter des conflits avec des données existantes
      references: {
        model: 'Users', // Nom de la table cible
        key: 'id', // Clé primaire de la table cible
      },
      onUpdate: 'CASCADE', // Met à jour "Clients.user_id" si "Users.id" change
      onDelete: 'SET NULL', // Définit "user_id" à NULL si l'utilisateur est supprimé
    });
  },

  // Méthode exécutée lors de l'annulation de la migration
  down: async (queryInterface, Sequelize) => {
    // Supprime la colonne "user_id" de la table "Owner"
    await queryInterface.removeColumn('Owner', 'user_id');

    // Supprime la colonne "user_id" de la table "Clients"
    await queryInterface.removeColumn('Clients', 'user_id');

    // Supprime la table "Users"
    await queryInterface.dropTable('Users');
  },
};
