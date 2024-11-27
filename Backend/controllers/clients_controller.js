// Model importation
const Clients = require("../models/clients");

// Get all client
const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll();
    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving clients", error });
  }
};

// Create new client
const createClient = async (req, res) => {
  try {
    // Getting request body form placeholder
    const { name, surname, address, birthdate, note } = req.body;

    // Client creation
    const client = await Clients.create({
      name,
      surname,
      address,
      birthdate,
      note,
    });

    res.status(201).json({ message: "Client created successfully!", client });
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    // Getting client id from forms params
    const { id } = req.params;
    // Verifying if client exists
    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Owner not found" });
    }

    await Clients.destroy({ where: { id } });
    res.status(200).json({ message: "Client correctly deleted" });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting owner" });
  }
};

//Modify client
const modifyClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, address, birthdate, note } = req.body;

    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found !" });
    }
    // updating owner with new name
    await client.update({ name, surname, address, birthdate, note });

    res.status(200).json({
      message: "Owner successfully updated",
      client,
    });
  } catch (error) {
    console.error("Error during modifying process :", error);
    res.status(500).json({ message: "Error updating client" });
  }
};

module.exports = {
  getAllClients,
  createClient,
  deleteClient,
  modifyClient,
};
