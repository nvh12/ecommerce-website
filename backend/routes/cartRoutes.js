const express = require('express');
const { cart, add, reduce, remove, clear, checkout } = require('../controllers/cartController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get('/', cart);
router.post('/add', add);
router.post('/reduce', reduce);
router.post('/remove', remove);
router.post('/clear', clear);
router.post('/checkout', checkout);

module.exports = router;