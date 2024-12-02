/**
 * Users_Controller.js
 * This file contains functions to manage users.
 * Functions include retrieving all users, creating new users, deleting users,
 * and modifying user details while maintaining referential integrity with clients.
 */

// Model importation
const Users = require("../models/users");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ message: "List of all users", users });
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { email, password_hash, role } = req.body;
    const user = await Users.create({ email, password_hash, role });

    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Users.destroy({ where: { id } });
    res.status(200).json({ message: "User correctly deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Update a user
const modifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password_hash, role } = req.body;

    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ email, password_hash, role });
    res.status(200).json({
      message: "User successfully updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  modifyUser,
  deleteUser,
};
