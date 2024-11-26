const { Sequelize } = require('sequelize');

// Créer une instance de Sequelize pour la connexion à PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // Ou l'IP de ton serveur PostgreSQL
  username: 'lerosier', // Remplace par ton nom d'utilisateur
  password: '', // Remplace par ton mot de passe
  database: 'Hotel-project', // Nom de ta base de données
  logging: false, // Pour désactiver les logs des requêtes SQL dans la console
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to database successful!');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
