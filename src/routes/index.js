const express = require('express');
const router = express.Router();
const { getRecords, addRecord, editRecord, deleteRecord, getUserData } = require('../controllers/recordsController');
const { login } = require('../controllers/authController');
const { getRecordsByTableId } = require('../controllers/recordsController');

// Rutas para las operaciones CRUD
router.get('/records', getRecords);
router.get('/recordsByTable/:id', getRecordsByTableId); 
router.post('/records', addRecord);
router.put('/records/:id', editRecord);
router.delete('/records/:id', deleteRecord);

router.get('/userData/:id', getUserData);


// Ruta de login
router.post('/login', login);

module.exports = router;
