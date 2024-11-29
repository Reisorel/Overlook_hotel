const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const routes = require("./routes/routes.js");
const Rooms = require("./models/rooms");
const Clients = require("./models/clients");
const Reservations = require("./models/reservations");
const Owners = require("./models/owner");
const Users = require("./models/users");
const defineAssociations = require("./models/associations");

const app = express();
const port = 3000;

// Active CORS pour permettre les requêtes depuis d'autres origines (frontend par exemple)
app.use(cors());
app.use(bodyParser.json()); // Pour parser le corps de la requête en JSON

app.use("/api", routes);

// Définit le dossier contenant les fichiers compilés du frontend à servir comme fichiers statiques
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Tester la connexion à la base de données et démarrer le serveur uniquement si la connexion est réussie
sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connection established successfully");

    // Import associations links from associations.js
    defineAssociations();

    // Check if rooms table is accessible
    try {
      const room = await Rooms.findOne();
      if (room) {
        console.log("Table 'Rooms' loaded !");
      } else {
        console.log("Table 'Rooms' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Rooms' table :", error);
    }
    // Check if owner table is accessible
    try {
      const owner = await Owners.findOne();
      if (owner) {
        console.log("Table 'owner' loaded !");
      } else {
        console.log("Table 'owner' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Rooms' table :", error);
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
    }
    // Vérifier si la table Reservations est accessible
    try {
      const reservation = await Reservations.findOne();
      if (reservation) {
        console.log("Table 'Reservations' loaded !");
      } else {
        console.log("Table 'Reservations' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Reservations' table :", error);
    }
    // Check if user table is accessible
    try {
      const user = await Users.findOne();
      if (user) {
        console.log("Table 'Users' loaded !");
      } else {
        console.log("Table 'Users' loaded but not data found.");
      }
    } catch (error) {
      console.error("Error accessing 'Users' table :", error);
    }

    // Démarre le serveur après une connexion réussie à la base de données et vérification de la table
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Capture toutes les requêtes non gérées par les fichiers statiques et renvoie le fichier index.html (SPA React)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});
