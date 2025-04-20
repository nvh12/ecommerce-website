const express = require('express');
const { cart, add, reduce, remove, clear, checkout } = require('../controllers/cartController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', cart); // Lấy giỏ 
router.post('/add', add); // Thêm đồ
router.post('/reduce', reduce); // Giảm đồ 
router.post('/remove', remove); // Bỏ toàn bộ 1 mặt hàng 
router.post('/clear', clear); // Bỏ cả giỏ
router.post('/checkout', checkout); // Check out, thanh toántoán

module.exports = router;