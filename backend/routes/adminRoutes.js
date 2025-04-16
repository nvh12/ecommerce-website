const express = require('express');
const { getOrders, updateOrder } = require('../controllers/adminController');
const { verifyRole, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'));

router.get('/order', getOrders);
router.put('/order', updateOrder);

module.exports = router;