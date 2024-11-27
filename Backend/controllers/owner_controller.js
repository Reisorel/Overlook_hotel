const Owner = require("../models/owner"); // Assure-toi d'importer le modèle correctement

// Create owner
const createOwner = async (req, res) => {
  try {
    const { name } = req.body; // Récupère le nom du propriétaire depuis la requête

    const owner = await Owner.create({ name });

    res.status(201).json({ message: "Owner created successfully!", owner }); // Retourne le propriétaire créé
  } catch (error) {
    res.status(500).json({ message: "Error creating owner", error });
  }
};

// Get all owners
const getAllOwners = async (req, res) => {
  try {
    // Récupère tous les propriétaires
    const owners = await Owner.findAll();

    if (!owners.length) {
      return res.status(404).json({ message: "No owners found" }); // Si aucun propriétaire n'est trouvé
    }

    res.status(200).json({ message: "List of all owners", owners }); // Retourne tous les propriétaires
  } catch (error) {
    res.status(500).json({ message: "Error getting owners", error });
  }
};

// Delete owner
const deleteOwner = async (req, res) => {
  try {
    // Getting owner id form params
    const { id } = req.params;

    // Verifying if owner exists
    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // deleting owner
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
    // Getting owner id
    const { id } = req.params;
    // Getting new name from body
    const { name } = req.body;
    // Checking if owner exists :
    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    // updating owner with new name
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
