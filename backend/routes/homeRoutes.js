const express = require('express');
const { getHomeMessage } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHomeMessage);

module.exports = router;
