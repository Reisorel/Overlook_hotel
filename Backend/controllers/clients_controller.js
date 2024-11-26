// Getting client list :
const Clients = require('../models/clients'); // Importation correcte du modèle

// Récupération de la liste des clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll(); // Récupère tous les clients depuis la base
    res.status(200).json({ clients }); // Retourne la liste des clients
  } catch (error) {
    res.status(500).json({ message: "Error retrieving clients", error });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, surname, address, birthdate, note } = req.body; // Récupère les données du corps de la requête

    // Création du client avec les données récupérées
    const client = await Clients.create({
      name,
      surname,
      address,
      birthdate,
      note,
    });

    // Retourne le client créé dans la réponse
    res.status(201).json({ message: "Client created successfully!", client });
  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({ message: "Error creating client", error });
  }
};

module.exports = {
  getAllClients,
  createClient,
};
