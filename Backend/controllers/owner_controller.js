/**
 * Owner_Controller.js
 * This file contains functions to owners.
 * Functions include retrieving all owners, creating new owners, deleting owners,
 * and modifying owner details while maintaining referential integrity with users.
 */

// Model importation
const Owner = require("../models/owner");
const Users = require("../models/users");

// Get all owners
const getAllOwners = async (req, res) => {
  try {
    console.log("Fetching owners from database...");
    // Retrieve all owners.
    const owners = await Owner.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["email", "password_hash", "role"],
        },
      ],
    });

    console.log("Owners fetched:", owners); // Log all owners retrieved from the database to the console.

    // Handle case where no owners are found: return an empty result set with a descriptive message.
    res.status(200).json({
      message: owners.length
        ? "Owners retrieved successfully"
        : "No owners found",
      owners,
    });
  } catch (error) {
    console.error("Error fetching owners:", error); // Log the error for debugging purposes.
    res.status(500).json({ message: "Error retrieving owners", error });
  }
};

// Create new owner
const createOwner = async (req, res) => {
  try {
    // Extract properties from the request body
    const { name, email, password_hash } = req.body;

    if (!name) {
      console.log("Missing 'name' in request body.");
      return res
        .status(400)
        .json({ message: "Name is required" });
    }
    console.log("Received data for owner creation:", {
      name,
      email,
      password_hash
    });

    // Create a new user instance in the Users model
    console.log("Creating owner user model...");
    const user = await Users.create({
      email,
      password_hash,
      role: "owner",
    });
    console.log(`User created with ID: ${user.id}`);

    // Create a new owner instance in the Owner model
    console.log("Creating new owner...");
    const owner = await Owner.create({
      name,
      user_id: user.id // Associate the client with the user via the user_id foreign key
    });
    console.log(`Owner successfully created with ID: ${owner.id}`);


    // Getting owner with relation;
    console.log("Fetching owner with user relation...");
    const ownerWithUser = await Owner.findByPk(owner.id, {
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["email", "password_hash", "role"], // Include these fields
        },
      ],
    });

    res.status(201).json({ message: "Owner created successfully!", owner: ownerWithUser});
    console.log("Owner and user successfully created!");
  } catch (error) {
    console.error('An error occurred:', error);

    // Specific handling for Sequelize validation errors (e.g., unique constraint)
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log("Unique constraint error: Name already exists.");
      return res.status(400).json({ message: "Owner name already exists!" });
    }

    // Log unexpected errors
    console.error("Error creating owner:", error);
    res.status(500).json({ message: "Error creating owner", error });
  }
};

// Delete owner
const deleteOwner = async (req, res) => {
  try {
    // Extract owner ID from route parameters
    const { id } = req.params;

    if (!id) {
      console.log("No ID provided in request params.");
      return res.status(400).json({ message: "Owner ID is required!" });
    }

    console.log(`Received request to delete owner with ID: ${id}`);

    // Check if owner exists
    console.log("Checking if owner exists...");
    const owner = await Owner.findByPk(id);
    if (!owner) {
      console.log(`Owner with ID ${id} not found.`);
      return res.status(404).json({ message: "Owner not found" });
    }

    // Delete the associated user and owner to maintain referential integrity.
    await Users.destroy({ where: { id: owner.user_id } });

    console.log(`Deleting owner with ID: ${id}...`);
    await Owner.destroy({ where: { id } });
    console.log(`Owner with ID ${id} successfully deleted.`);
    res.status(200).json({ message: "Owner successfully deleted" });
  } catch (error) {
    console.error("Error deleting owner:", error);
    res.status(500).json({ message: "Error deleting owner", error });
  }
};

// Modify owner
const modifyOwner = async (req, res) => {
  try {
    // logging data sent from frontend
    console.log("Request body:", req.body);
    // Extract owner ID from route parameters
    const { id } = req.params;
    // Extract properties to update from the request body
    const { name, email, password_hash } = req.body;

    // Verifiying input data
    if (!id) {
      console.log("No ID provided in request params.");
      return res.status(400).json({ message: "Owner ID is required!" });
    }

    if (!name) {
      console.log("No 'name' provided in request body.");
      return res.status(400).json({ message: "Owner name is required!" });
    }

    console.log(`Received request to modify owner with ID: ${id}`);
    console.log("Received data for modification:", {
      name,
      email,
      password_hash,
    });

    // Checking owner existance
    console.log("Checking if owner exists...");
    const owner = await Owner.findByPk(id);
    if (!owner) {
      console.log(`Owner with ID ${id} not found.`);
      return res.status(404).json({ message: "Owner not found" });
    }

    // Prepare user update data
    const userUpdateData = {};
    // Retrieve email value from the request and add it to userUpdateData if provided
    if (email) userUpdateData.email = email;
    // Retrieve password value from the request and add it to userUpdateData if provided
    if (password_hash) userUpdateData.password_hash = password_hash;

    // Update the owner if new data detected in champs
    if (Object.keys(userUpdateData).length > 0) {
      await Users.update(userUpdateData, { where: { id: owner.user_id } });
    }
    // Update the owner data with the provided values; no changes will be made if no new values are sent.
    await owner.update({ name, email, password_hash, });

       // Get full owner owner with user relation
       const updatedOwner = await Owner.findByPk(id, {
        include: {
          model: Users,
          as: "user",
          attributes: ["email", "password_hash", "role"],
        },
      });

    // Send a success response with the updated owner
    console.log(`Owner with ID ${id} successfully updated:`, updatedOwner);
    res.status(200).json({
      message: "Owner and associated user successfully updated",
      owner: updatedOwner,
    });
  } catch (error) {
    console.error("Error during owner update:", error);
    // Handle unexpected errors during the update process
    res.status(500).json({ message: "Error updating owner", error });
  }
};
// Exporter les fonctions du contrôleur
module.exports = {
  getAllOwners,
  createOwner,
  deleteOwner,
  modifyOwner,
};
