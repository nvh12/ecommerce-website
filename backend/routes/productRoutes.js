const express = require("express")
const {
    createProductControl,
    findProductControl,
    deleteProductControl,
    updateProductControl,
    findOneProductControl
} = require("../controllers/productController");
const router = express.Router();

router.post('/', createProductControl);
router.get('/', findProductControl);  
router.get("/:_id", findOneProductControl)
router.delete('/:_id', deleteProductControl);
router.put('/:_id', updateProductControl);

module.exports = router