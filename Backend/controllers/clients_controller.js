/**
 * Clients_Controller.js
 * This file contains functions to manage clients and their associated users.
 * Functions include retrieving all clients, creating new clients, deleting clients,
 * and modifying client details while maintaining referential integrity with users.
 */

// Model importation
const Clients = require("../models/clients");
const Users = require("../models/users");
const Reservations = require("../models/reservations")

// Get all client
const getAllClients = async (req, res) => {
  try {
    console.log("Fetching clients from database...");
    // Retrieve all clients, including 'email' and 'role' from the associated Users model for contextual information.
    const clients = await Clients.findAll({
      include: [
        {
          model: Users,
          as: "user", // Mandatory alias for Sequelize associations (as defined in the Clients model).
          attributes: ["email", "password_hash", "role"], // Select specific properties from Users model.
        },
      ],
    });

    console.log("Clients fetched:", clients); // Log all clients retrieved from the database to the console.

    // Handle case where no clients are found: return an empty result set with a descriptive message.
    res.status(200).json({
      message: clients.length
        ? "Client retrieved successfully"
        : "No clients found",
      clients,
    });
  } catch (error) {
    console.log("Error fetching clients", error);
    res.status(500).json({ message: "Error retrieving clients", error });
  }
};

// Create new client
const createClient = async (req, res) => {
  try {
    // Extract properties from the request body
    const { name, surname, address, birthdate, note, email, password_hash } =
      req.body;
    // Ensure email and password are provided as they are mandatory for user authentication.
    if (!email || !password_hash) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }
    console.log("Received data for client creation:", {
      name,
      surname,
      address,
      birthdate,
      note,
      email,
      password_hash,
    });

    // Create a new user instance in the Users model
    console.log("Creating client user model...");
    const user = await Users.create({
      email,
      password_hash,
      role: "client",
    });
    console.log(`User created with ID: ${user.id}`);

    // Create a new client instance in the Clients model, linked to the newly created user
    console.log("Creating client model...");
    const client = await Clients.create({
      name,
      surname,
      address,
      birthdate,
      note,
      user_id: user.id, // Associate the client with the user via the user_id foreign key
    });
    console.log(`Client created with ID: ${client.id}`);


     // Getting client with relation;
     console.log("Fetching client with user relation...");
     const clientWithUser = await Clients.findByPk(client.id, {
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["email", "password_hash", "role"], // Include these fields
        },
      ],
    });

    res
      .status(201)
      .json({ message: "Client and user created successfully!", client: clientWithUser });
      console.log("Client and user successfully created!");

  } catch (error) {
    console.error('An error occurred:', error);

    // Handle case where the email already exists to enforce uniqueness in the database.
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists!" });
    }
    res.status(500).json({ message: "Error creating client", error });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    // Extract client ID from route parameters
    const { id } = req.params;

    const client = await Clients.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Vérifier si le client possède des réservations
    const reservation = await Reservations.findOne({ where: { id_clients: id } });

    if (reservation) {
      console.log(`❌ Cannot delete client ${id}: Active reservation found (ID ${reservation.id}).`);
      return res.status(400).json({
        message: `Cannot delete client: Client with ID ${id} has an active reservation (ID ${reservation.id}).`
      });
    }

    // Delete the associated user and client to maintain referential integrity.
    await Users.destroy({ where: { id: client.user_id } });

    console.log(`Deleting client with ID: ${id}...`);
    await Clients.destroy({ where: { id } }); // Delete the client from the Clients table
    console.log(`Client with ID ${id} has been successfully deleted.`);
    res.status(200).json({ message: `Client with ID ${id} and associated user correctly deleted` });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
};

//Modify client
const modifyClient = async (req, res) => {
  try {
    // logging data sent from frontend
    console.log("Request body:", req.body);
    // Extract client ID from route parameters
    const { id } = req.params;
    // Extract properties to update from the request body
    const { name, surname, address, birthdate, note, email, password_hash } = req.body;

    console.log(`Attempting to modify clienyt with ID: ${id}`);
    console.log("Received data for modification:", {
      name,
      surname,
      address,
      birthdate,
      note,
      email,
      password_hash,
    });

    // Find the client by primary key and handle the case where the client is not found
    const client = await Clients.findByPk(id);
    if (!client) {
      console.log(`Client with ID ${id} not found.`);
      return res.status(404).json({ message: "Client not found!" });
    }

    // Prepare data for updating the associated user; only update fields if email or password is provided to avoid unnecessary changes.
    const userUpdateData = {};
    // Retrieve email value from the request and add it to userUpdateData if provided
    if (email) userUpdateData.email = email;
    // Retrieve password value from the request and add it to userUpdateData if provided
    if (password_hash) userUpdateData.password_hash = password_hash;

    // Update the client if new data detected in champs
    if (Object.keys(userUpdateData).length > 0) {
      await Users.update(userUpdateData, { where: { id: client.user_id } });
    }
    // Update the client data with the provided values; no changes will be made if no new values are sent.
    await client.update({ name, surname, address, birthdate, note });

    // Get full client data with user relation
    const updatedClient = await Clients.findByPk(id, {
      include: {
        model: Users,
        as: "user",
        attributes: ["email", "password_hash", "role"],
      },
    });

    // Send a success response with the updated client
    console.log(`Client with ID ${id} successfully updated:`, client);
    res.status(200).json({
      message: "Client and associated user successfully updated",
      client: updatedClient,
    });
  } catch (error) {
    console.error("Error during client update:", error); // Afficher les détails de l'erreur
    // Handle unexpected errors during the update process
    res.status(500).json({ message: "Error updating client", error });
  }
};

// Exporting all functions to router
module.exports = {
  getAllClients,
  createClient,
  deleteClient,
  modifyClient,
};
