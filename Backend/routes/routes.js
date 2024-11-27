
const express = require('express');
const router = express.Router();

const OwnerController = require('../controllers/owner_controller');
const ClientsController = require('../controllers/clients_controller');
const RoomsController = require('../controllers/rooms_controller');

// Routes for owners
router.get('/owners', OwnerController.getAllOwners);
router.post('/owners', OwnerController.createOwner);
router.delete('/owners/:id', OwnerController.deleteOwner);
router.put('/owners/:id', OwnerController.modifyOwner);

// Routes for clients
router.get('/clients', ClientsController.getAllClients)
router.post('/clients', ClientsController.createClient)
router.delete('/clients/:id', ClientsController.deleteClient);
router.put('/clients/:id', ClientsController.modifyClient);

// Routes for rooms
router.get('/rooms', RoomsController.getAllRooms)
router.post('/rooms', RoomsController.createRoom)
router.delete('/rooms/:id', RoomsController.deleteRoom);
router.put('/rooms/:id', RoomsController.modifyRoom);

module.exports = router;
