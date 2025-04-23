const express = require('express');
const { getOrders, updateOrder, getUsers } = require('../controllers/adminController');
const { verifyRole, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'));

router.get('/order', getOrders); // Lấy các đơn hàng
// admin/order?page=${page}&sortBy=${sortBy}&order=${order}
// ưu tiên page, còn lại để sau cx đc
router.put('/order/:id', updateOrder); // Cập nhật đơn hàng
// req.body nên để đầy đủ các trường của order 
router.get('/user', getUsers); //Lấy user
// admin/user?name=${name}
// nếu ko có name trả tất cả user
module.exports = router;