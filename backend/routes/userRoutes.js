const express = require('express');
const { getUserMessage } = require('../controllers/userController');
const { verifyUser } = require('../middleware/authMiddleware')

const router = express.Router();

router.use(verifyUser);

router.get('/', getUserMessage);

module.exports = router;
