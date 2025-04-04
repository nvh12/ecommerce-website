const express = require('express');
const { getAdminMessage } = require('../controllers/adminController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'))

router.get('/', getAdminMessage);

module.exports = router;