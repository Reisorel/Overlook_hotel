const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser"); // Pour analyser les données JSON
const sequelize = require("./db");  // Connexion Sequelize
const routes = require('./routes/routes.js');  // Assurez-vous d'importer correctement les routes



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
  .then(() => {
    console.log('Database connection established successfully');

    // Démarre le serveur après une connexion réussie à la base de données
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
