const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser"); // Pour analyser les données JSON
const sequelize = require("./db");  // Connexion Sequelize
const routes = require('./routes/routes.js');  // Importation des routes
const Rooms = require('./models/rooms'); // Importation du modèle Rooms
const Clients = require('./models/clients'); // Importation du modèle Rooms

const app = express();
const port = 3000;

// Active CORS pour permettre les requêtes depuis d'autres origines (frontend par exemple)
app.use(cors());
app.use(bodyParser.json());  // Pour parser le corps de la requête en JSON

app.use('/api', routes);

// Définit le dossier contenant les fichiers compilés du frontend à servir comme fichiers statiques
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Tester la connexion à la base de données et démarrer le serveur uniquement si la connexion est réussie
sequelize.authenticate()
  .then(async () => {
    console.log('Database connection established successfully');

    // Vérifier si la table Rooms est accessible
    try {
      const room = await Rooms.findOne();
      if (room) {
        console.log("Table 'Rooms' loaded !");
      } else {
        console.log("Table 'Rooms' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Rooms' table :", error);
      // Si vous souhaitez arrêter le démarrage du serveur en cas d'erreur, décommentez la ligne suivante :
      // throw error;
    }
    // Vérifier si la table Clients est accessible
    try {
      const client = await Clients.findOne();
      if (client) {
        console.log("Table 'Clients' loaded !");
      } else {
        console.log("Table 'Clients' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Clients' table :", error);
      // Si vous souhaitez arrêter le démarrage du serveur en cas d'erreur, décommentez la ligne suivante :
      // throw error;
    }

    // Démarre le serveur après une connexion réussie à la base de données et vérification de la table
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Capture toutes les requêtes non gérées par les fichiers statiques et renvoie le fichier index.html (SPA React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});
