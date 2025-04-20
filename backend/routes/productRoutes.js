const express = require("express")
const {
    createProductControl,
    findProductControl,
    deleteProductControl,
    updateProductControl,
    findOneProductControl
} = require("../controllers/productController");
const router = express.Router();

router.post('/', createProductControl); // Tạo mới sản phẩm
router.get('/', findProductControl);  // Tim  kiếm thông qua query, tìm các trườngtrường thông tin của sản phẩm như
//search(tên),  category, features(một số chức năng), brand, dir(desc hoặc asc theo cột trong order),order, priceMax, priceMin
// VD: product/?search=iphone&features=choi-game&dir=desc&order=price?priceMax=20000000?priceMin=5000000
router.get("/:_id", findOneProductControl) // Tìm kiếm duy nhất 1 sản phẩm dựa theo id
router.delete('/:_id', deleteProductControl);// Xóa sản phẩm theo id
router.put('/:_id', updateProductControl);// update sản phẩm theo id

module.exports = router