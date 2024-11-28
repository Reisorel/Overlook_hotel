const Owner = require("../models/owner");

// Get all owners
const getAllOwners = async (req, res) => {
  try {

    const owners = await Owner.findAll();
    if (!owners.length) {
      return res.status(404).json({ message: "No owners found" });
    }
    res.status(200).json({ message: "List of all owners", owners });
  } catch (error) {
    res.status(500).json({ message: "Error getting owners", error });
  }
};

// Create owner
const createOwner = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = await Owner.create({ name });

    res.status(201).json({ message: "Owner created successfully!", owner });
  } catch (error) {
    res.status(500).json({ message: "Error creating owner", error });
  }
};

// Delete owner
const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    await Owner.destroy({ where: { id } });
    res.status(200).json({ message: "Owner correctly deleted" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Error deleting owner" });
  }
};

// Modify owner
const modifyOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    await owner.update({ name });

    res.status(200).json({
      message: "Owner successfully updated",
      owner,
    });
  } catch (error) {
    console.error("Erreur dans modifyOwner :", error);
    res.status(500).json({ message: "Error updating owner" });
  }
};

// Exporter les fonctions du contrôleur
module.exports = {
  getAllOwners,
  createOwner,
  deleteOwner,
  modifyOwner,
};
