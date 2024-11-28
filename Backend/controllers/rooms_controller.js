// Model importation
const Rooms = require("../models/rooms");

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.findAll();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rooms", error });
  }
};

// Create room
const createRoom = async (req, res) => {
  try {
    const { name, type, price, available, description, capacity, id_owner } = req.body;
    const room = await Rooms.create({
      name,
      type,
      price,
      available,
      description,
      capacity,
      id_owner,
    });

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Error creating Room", error });
  }
};

// Delete Room
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Rooms.destroy({ where: { id } });
    res.status(200).json({ message: "Room correctly deleted" });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting room" });
  }
};

//Modify room
const modifyRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, available, description, capacity, id_owner } = req.body;

    const room = await Rooms.findByPk(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found !" });
    }
    await room.update({ name, type, available, description, capacity, id_owner });

    res.status(200).json({
      message: "Room successfully updated",
      room,
    });
  } catch (error) {
    console.error("Error during modifying process :", error);
    res.status(500).json({ message: "Error updating room" });
  }
};

module.exports = {
  getAllRooms,
  createRoom,
  deleteRoom,
  modifyRoom,
};
