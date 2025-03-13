/**
 * Rooms_Controller.js
 * This file contains functions to manage rooms and their associated owners.
 * Functions include retrieving all rooms, creating new rooms, deleting rooms,
 * and modifying room details.
 */

// Model importation
const Rooms = require("../models/rooms");
const Owners = require('../models/owner');
const Reservations = require('../models/reservations')


// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    console.log("Fetching rooms from database...");

    // Retrieve all rooms
    const rooms = await Rooms.findAll();

    // Log the number of rooms fetched
    if (!rooms.length) {
      console.log("No rooms found in the database.");
      return res.status(200).json({
        message: "No rooms available",
        rooms: [],
      });
    }

    console.log(`Number of rooms fetched: ${rooms.length}`);
    console.log("Rooms fetched:", rooms);

    res.status(200).json({
      message: "Rooms retrieved successfully",
      rooms,
    });

  } catch (error) {
    console.error("Error retrieving rooms:", error);
    res.status(500).json({ message: "Error retrieving rooms", error });
  }
};


// Create new room
const createRoom = async (req, res) => {
  try {
    // Extract properties from the request body
    const { name, type, price, available, description, capacity, id_owner } = req.body;

    // Checking input entries
    if (!name || !type || !price || capacity === undefined || id_owner === undefined) {
      console.log("Missing required fields for room creation.");
      return res.status(400).json({
        message: "Missing required fields: name, type, price, capacity, id_owner are mandatory.",
      });
    }

    console.log("Received data for room creation:", {
      name,
      type,
      price,
      available,
      description,
      capacity,
      id_owner,
    });

    // Checking if owner exists
    console.log(`Checking if owner with ID ${id_owner} exists...`);
    const ownerExists = await Owners.findByPk(id_owner);
    if (!ownerExists) {
      console.log(`Owner with ID ${id_owner} not found. Impossible to create room`);
      return res.status(404).json({ message: "Owner not found, cannot create room." });
    }

    // Creating new room
    console.log("Creating new room...");
    const room = await Rooms.create({
      name,
      type,
      price,
      available: available !== undefined ? available : true,
      description,
      capacity,
      id_owner,
    });

    console.log("Room successfully created:", room);

    res.status(201).json({ message: "Room created successfully", room });

  } catch (error) {
    // Handeling specific errors
    if (error.name === "SequelizeValidationError") {
      console.log("Validation error during room creation:", error.errors);
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }

    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating Room", error });
  }
};


// Delete Room
const deleteRoom = async (req, res) => {
  try {
    // Extract room ID from route parameters
    const { id } = req.params;
    if (!id) {
      console.log("No ID provided in the request parameters.");
      return res.status(400).json({ message: "Room ID is required to delete a room." });
    }

    console.log(`Attempting to delete room with ID: ${id}`);

    // Check if the room exists
    console.log("Checking if the room exists...");
    const room = await Rooms.findByPk(id);
    if (!room) {
      console.log(`Room with ID ${id} not found.`);
      return res.status(404).json({ message: "Room not found." });
    } else {
      console.log(`✅ Room with ID ${id} exists:`, room.dataValues);
    }

    // Check if the room has an active reservation
    console.log("Checking if the room has active reservations...");
    const activeReservation = await Reservations.findOne({ where: { id_rooms: id } });

    if (activeReservation) {
      console.log(`❌ Cannot delete room ${id}: Active reservation found (ID ${activeReservation.id}).`);
      return res.status(400).json({
        message: `Cannot delete room: Room with ID ${id} has an active reservation (ID ${activeReservation.id}).`,
        roomId: id,
        reservationId: activeReservation.id,
      });
    }

    // Delete the room
    console.log(`Deleting room with ID: ${id}...`);
    await Rooms.destroy({ where: { id } });
    console.log(`Room with ID ${id} has been successfully deleted.`);

    res.status(200).json({ message: "Room successfully deleted." });

  } catch (error) {
    console.error("Error during the deletion process:", error);
    res.status(500).json({ message: "Error deleting room.", error });
  }
};


// Modify room
const modifyRoom = async (req, res) => {
  try {
    // Logging the full request body
    console.log("Request body:", req.body);

    // Extract room ID from route parameters
    const { id } = req.params;

    // Extract properties to update from the request body
    const { name, type, available, description, capacity, id_owner } = req.body;

    if (!id) {
      console.log("No ID provided in request parameters.");
      return res.status(400).json({ message: "Room ID is required to modify a room." });
    }

    console.log(`Attempting to modify room with ID: ${id}`);
    console.log("Received data for modification:", {
      name,
      type,
      available,
      description,
      capacity,
      id_owner,
    });

    // Find the room by primary key and handle the case where the room is not found
    console.log("Checking if the room exists...");
    const room = await Rooms.findByPk(id);
    if (!room) {
      console.log(`Room with ID ${id} not found.`);
      return res.status(404).json({ message: "Room not found." });
    }

    // Log current room data before update
    console.log(`Current room data before update:`, room.dataValues);

    // Log new data that will be updated
    console.log("New data to be updated:", {
      name: name || room.name,
      type: type || room.type,
      available: available !== undefined ? available : room.available,
      description: description || room.description,
      capacity: capacity || room.capacity,
      id_owner: id_owner || room.id_owner,
    });

    // Update room data
    await room.update({
      name: name || room.name,
      type: type || room.type,
      available: available !== undefined ? available : room.available,
      description: description || room.description,
      capacity: capacity || room.capacity,
      id_owner: id_owner || room.id_owner,
    });

    // Send a success response with the updated room
    console.log(`Room with ID ${id} successfully updated:`, room.dataValues);
    res.status(200).json({
      message: "Room successfully updated",
      room,
    });
  } catch (error) {
    console.error("Error during modifying process:", error);
    // Handle unexpected errors during the update process
    res.status(500).json({ message: "Error updating room", error });
  }
};


// Exporting all functions to router
module.exports = {
  getAllRooms,
  createRoom,
  deleteRoom,
  modifyRoom,
};
