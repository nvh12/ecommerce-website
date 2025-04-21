const express = require('express');
const { getOrders, updateOrder } = require('../controllers/adminController');
const { verifyRole, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'));

router.get('/order', getOrders); // Lấy các đơn hànghàng
router.put('/order', updateOrder); // CCập nhật đơn hànghàng

module.exports = router;