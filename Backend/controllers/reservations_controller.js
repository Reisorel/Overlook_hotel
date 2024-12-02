// Model importation
const Reservations = require("../models/reservations");
const Rooms = require("../models/Rooms");
const Clients = require("../models/Clients");

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    console.log("Fetching all reservations from the database...");

    // Retrieve all reservations
    const reservations = await Reservations.findAll();

    // Log the number of reservations fetched
    if (!reservations.length) {
      console.log("No reservations found in the database.");
      return res.status(200).json({
        message: "No reservations available",
        reservations: [],
      });
    }

    console.log(`Number of reservations fetched: ${reservations.length}`);
    console.log("Reservations fetched:", reservations);

    res.status(200).json({
      message: "Reservations retrieved successfully",
      reservations,
    });
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    res.status(500).json({
      message: "Error retrieving reservations",
      error,
    });
  }
};

// Create new reservation
const createReservation = async (req, res) => {
  try {
    // Extract data from the request body
    const { check_in, check_out, id_rooms, id_clients, number_of_people } = req.body;

    // Log the received data
    console.log("Received data for reservation creation:", {
      check_in,
      check_out,
      id_rooms,
      id_clients,
      number_of_people,
    });

    // Validate required fields
    if (!check_in || !check_out || !id_rooms || !id_clients || !number_of_people) {
      console.log("Missing required fields for reservation creation.");
      return res.status(400).json({
        message: "All fields are required: check_in, check_out, id_rooms, id_clients, number_of_people.",
      });
    }

    // Check if the room exists
    console.log(`Checking if room with ID ${id_rooms} exists...`);
    const roomExists = await Rooms.findByPk(id_rooms);
    if (!roomExists) {
      console.log(`Room with ID ${id_rooms} not found.`);
      return res.status(404).json({ message: "Room not found, cannot create reservation." });
    }

    // Check if the client exists
    console.log(`Checking if client with ID ${id_clients} exists...`);
    const clientExists = await Clients.findByPk(id_clients);
    if (!clientExists) {
      console.log(`Client with ID ${id_clients} not found.`);
      return res.status(404).json({ message: "Client not found, cannot create reservation." });
    }

    // Log the new data before creation
    console.log("Creating new reservation with data:", {
      check_in,
      check_out,
      id_rooms,
      id_clients,
      number_of_people,
    });

    // Create the reservation
    const reservation = await Reservations.create({
      check_in,
      check_out,
      id_rooms,
      id_clients,
      number_of_people,
    });

    // Log the successful creation
    console.log("Reservation successfully created:", reservation);

    res.status(201).json({
      message: "Reservation created successfully!",
      reservation,
    });
  } catch (error) {
    console.error("Error during reservation creation:", error);
    res.status(500).json({
      message: "Error creating reservation",
      error,
    });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    // Extract reservation ID from route parameters
    const { id } = req.params;

    if (!id) {
      console.log("No ID provided in request parameters.");
      return res.status(400).json({ message: "Reservation ID is required to delete a reservation." });
    }

    console.log(`Attempting to delete reservation with ID: ${id}`);

    // Check if the reservation exists
    console.log("Checking if the reservation exists...");
    const reservation = await Reservations.findByPk(id);
    if (!reservation) {
      console.log(`Reservation with ID ${id} not found.`);
      return res.status(404).json({ message: "Reservation not found." });
    }

    // Log current reservation data before deletion
    console.log(`Current reservation data to be deleted:`, reservation.dataValues);

    // Delete the reservation
    console.log(`Deleting reservation with ID: ${id}...`);
    await Reservations.destroy({ where: { id } });
    console.log(`Reservation with ID ${id} has been successfully deleted.`);

    res.status(200).json({
      message: "Reservation successfully deleted.",
    });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting reservation", error });
  }
};

// Modify reservation
const modifyReservation = async (req, res) => {
  try {
    // Extract reservation ID from route parameters
    const { id } = req.params;

    // Extract updated fields from the request body
    const { check_in, check_out, id_rooms, id_clients, number_of_people } = req.body;

    console.log("Received data for reservation modification:", {
      check_in,
      check_out,
      id_rooms,
      id_clients,
      number_of_people,
    });

    if (!id) {
      console.log("No ID provided in request parameters.");
      return res.status(400).json({ message: "Reservation ID is required to modify a reservation." });
    }

    console.log(`Attempting to modify reservation with ID: ${id}`);

    // Check if the reservation exists
    console.log("Checking if the reservation exists...");
    const reservation = await Reservations.findByPk(id);
    if (!reservation) {
      console.log(`Reservation with ID ${id} not found.`);
      return res.status(404).json({ message: "Reservation not found." });
    }

    // Log current reservation data before modification
    console.log("Current reservation data before modification:", reservation.dataValues);

    // Validate related entities (room and client)
    if (id_rooms) {
      console.log(`Checking if room with ID ${id_rooms} exists...`);
      const roomExists = await Rooms.findByPk(id_rooms);
      if (!roomExists) {
        console.log(`Room with ID ${id_rooms} not found.`);
        return res.status(404).json({ message: "Room not found, cannot modify reservation." });
      }
    }

    if (id_clients) {
      console.log(`Checking if client with ID ${id_clients} exists...`);
      const clientExists = await Clients.findByPk(id_clients);
      if (!clientExists) {
        console.log(`Client with ID ${id_clients} not found.`);
        return res.status(404).json({ message: "Client not found, cannot modify reservation." });
      }
    }

    // Log the new data to be updated
    console.log("New data to be updated:", {
      check_in: check_in || reservation.check_in,
      check_out: check_out || reservation.check_out,
      id_rooms: id_rooms || reservation.id_rooms,
      id_clients: id_clients || reservation.id_clients,
      number_of_people: number_of_people || reservation.number_of_people,
    });

    // Update the reservation
    console.log(`Updating reservation with ID: ${id}...`);
    await reservation.update({
      check_in: check_in || reservation.check_in,
      check_out: check_out || reservation.check_out,
      id_rooms: id_rooms || reservation.id_rooms,
      id_clients: id_clients || reservation.id_clients,
      number_of_people: number_of_people || reservation.number_of_people,
    });

    console.log(`Reservation with ID ${id} successfully updated.`);

    res.status(200).json({
      message: "Reservation successfully updated",
      reservation,
    });
  } catch (error) {
    console.error("Error during modifying process:", error);
    res.status(500).json({ message: "Error updating reservation", error });
  }
};


// Exporter les fonctions du contrôleur
module.exports = {
  getAllReservations,
  createReservation,
  deleteReservation,
  modifyReservation,
};
