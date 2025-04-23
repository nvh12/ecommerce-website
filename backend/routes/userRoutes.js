const express =  require('express');
const { user, userOrders, singleOrder } = require('../controllers/userController')
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', user); // Lấy thông tin profile người dùng 
router.get('/order', userOrders); // Lấy các đơn của người dùng 
// user/order?page=${page}&sortBy=${sortBy}&order=${order}
// ưu tiên page, còn lại để sau cx đc
router.get('/order/:id', singleOrder); // Lấy thông tin 1 đơn cụ thể 

module.exports = router;