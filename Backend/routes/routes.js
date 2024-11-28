
const express = require('express');
const router = express.Router();

const OwnerController = require('../controllers/owner_controller');
const ClientsController = require('../controllers/clients_controller');
const RoomsController = require('../controllers/rooms_controller');
const ReservationController = require('../controllers/reservations_controller')

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

// Routes for reservation
router.get('/reservations', ReservationController.getAllReservations)
router.post('/reservations', ReservationController.createReservation)
router.delete('/reservations/:id', ReservationController.deleteReservation);
router.put('/reservations/:id', ReservationController.modifyReservation);

module.exports = router;
