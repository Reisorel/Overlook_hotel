// Model importation
const Clients = require("../models/clients");
const Users = require("../models/users");

// Get all client
const getAllClients = async (req, res) => {
  try {
    console.log("Fetching clients from database...");

    const clients = await Clients.findAll({
      include: [
        {
          model: Users,
          as: 'user', // Assure-toi que cet alias est correct
          attributes: ['email', 'role'],
        },
      ],
    });

    console.log("Clients fetched:", clients); // Affiche les clients récupérés

    if (!clients.length) {
      console.log("No clients found");
      return res.status(404).json({ message: "No clients found" });
    }

    res.status(200).json({ message: "Clients retrieved successfully", clients });
  } catch (error) {
    console.error("Error fetching clients:", error); // Affiche l'erreur
    res.status(500).json({ message: "Error retrieving clients", error });
  }
};


// Create new client
const createClient = async (req, res) => {
  try {
    const { email, password_hash, name, surname, address, birthdate, note } = req.body;
    //Mandatory mail & password.
    if (!email || !password_hash) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await Users.create({
      email,
      password_hash,
      role: "client",
    });

    const client = await Clients.create({
      name,
      surname,
      address,
      birthdate,
      note,
      user_id: user.id,
    });

    res.status(201).json({ message: "Client and user created successfully!", client, user });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists!" });
    }
    res.status(500).json({ message: "Error creating client", error });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    // Deleting client and associate user
    await Users.destroy({ where: { id: client.user_id } });

    await Clients.destroy({ where: { id } });
    res
      .status(200)
      .json({ message: "Client and associated user correctly deleted" });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
};

//Modify client
const modifyClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, address, birthdate, note, email, password_hash } = req.body;

    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found!" });
    }

    // Mise à jour conditionnelle des champs utilisateur
    const userUpdateData = {};
    if (email) userUpdateData.email = email;
    if (password_hash) userUpdateData.password_hash = password_hash;

    if (Object.keys(userUpdateData).length > 0) {
      await Users.update(userUpdateData, { where: { id: client.user_id } });
    }

    await client.update({ name, surname, address, birthdate, note });

    res.status(200).json({
      message: "Client and associated user successfully updated",
      client,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error });
  }
};

module.exports = {
  getAllClients,
  createClient,
  deleteClient,
  modifyClient,
};
