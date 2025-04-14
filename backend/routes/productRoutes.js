const express = require("express")
const {
    createProductControl,
    findProductControl,
    deleteProductControl,
    updateProductControl
} = require("../controllers/productController");
const router = express.Router();

router.post('/', createProductControl);
router.get('/:id?', findProductControl);  // tùy query hay id
router.delete('/:id', deleteProductControl);
router.put('/:id', updateProductControl);

module.exports = router