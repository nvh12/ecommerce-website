const express = require('express');
const { getOrders, updateOrder, getUsers, getUserOrders, getSingleOrder, getSingleUser, updateUser } = require('../controllers/adminController');
const { verifyRole, verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);
router.use(verifyRole('admin'));

router.get('/order', getOrders); // Lấy các đơn hàng
// admin/order?page=${page}&sortBy=${sortBy}&order=${order}
// ưu tiên page, còn lại để sau cx đc
router.get('/order/:id', getSingleOrder);
router.put('/order/:id', updateOrder); // Cập nhật đơn hàng
// req.body nên để đầy đủ các trường của order 
router.get('/user', getUsers); //Lấy user
// admin/user?name=${name}
// nếu ko có name trả tất cả user
router.get('/user/:id', getSingleUser);
router.put('/user/:id', updateUser);
router.get('/user/order', getUserOrders); //Lấy các order của user
// admin/user/order?id=${id}&page=${page}&sortBy=${sortBy}&order=${order}
// ko cần sắp xếp thì bỏ sortBy với order
module.exports = router;