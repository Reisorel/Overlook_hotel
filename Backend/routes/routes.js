
const express = require('express');
const router = express.Router();
const OwnerController = require('../controllers/owner_controller');
const ClientsController = require('../controllers/clients_controller')

// Routes for owners
router.get('/owners', OwnerController.getAllOwners);
router.post('/owners', OwnerController.createOwner);
router.delete('/owners/:id', OwnerController.deleteOwner);
router.put('/owners/:id', OwnerController.modifyOwner);

// Routes for clients
router.get('/clients', ClientsController.getAllClients)
router.post('/clients', ClientsController.createClient)

module.exports = router;
