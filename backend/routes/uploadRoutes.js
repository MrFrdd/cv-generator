const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, uploadMiddleware.single('photo'), uploadController.uploadPhoto);

module.exports = router;
