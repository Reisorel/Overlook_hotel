// Model importation
const Reservations = require("../models/reservations");

// Get all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservations.findAll();
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Reservations", error });
  }
};

// Create new reservation
const createReservation = async (req, res) => {
  try {
    const { check_in, check_out, id_rooms, id_clients, number_of_people } = req.body;
    const reservation = await Reservations.create({
      check_in,
      check_out,
      id_rooms,
      id_clients,
      number_of_people,
    });

    res.status(201).json({ message: "Reservation created successfully!", reservation });
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservations.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    await Reservations.destroy({ where: { id } });
    res.status(200).json({ message: "Reservation correctly deleted" });
  } catch (error) {
    console.error("Error during deleting process:", error);
    res.status(500).json({ message: "Error deleting reservation" });
  }
};

// Modify reservation
const modifyReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { check_in, check_out, id_rooms, id_clients, number_of_people} = req.body;
    const reservation = await Reservations.findByPk(id);
    if (!reservation) {
      return res.status(404).json({message : "Reservation not found !"})
    }
    await reservation.update({ check_in, check_out, id_rooms, id_clients, number_of_people });

    res.status(200).json({
      message: "Reservation successfully updated",
      reservation,
    });
  } catch (error) {
    console.error("Error during modifying process :", error);
    res.status(500).json({ message: "Error updating reservation" });
  }
}

// Exporter les fonctions du contrôleur
module.exports = {
  getAllReservations,
  createReservation,
  deleteReservation,
  modifyReservation,
};
