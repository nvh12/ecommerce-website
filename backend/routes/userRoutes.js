const express = require('express');
const { getUserMessage } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUserMessage);

module.exports = router;
