const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middleware/authMiddleware');

// Semua rute CV terlindungi oleh authMiddleware
router.use(authMiddleware);

router.get('/', cvController.getUserCVs);
router.post('/', cvController.createCV);
router.get('/:id', cvController.getCVById);
router.put('/:id', cvController.updateCV);
router.patch('/:id/template', cvController.updateTemplate);
router.delete('/:id', cvController.deleteCV);

module.exports = router;
