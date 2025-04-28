const express = require("express")
const {
    createProductControl,
    findProductControl,
    deleteProductControl,
    updateProductControl,
    findOneProductControl,
    findPageControl
} = require("../controllers/productController");
const {findBrandControl,findCategoryControl}= require("../controllers/indexController")
const { verifyUser, verifyRole} = require('../middleware/authMiddleware');
const router = express.Router();

// Tạo mới sản phẩm
//Yêu cầu đầu vào ở body
// productName cần có
//     brand cần có
//     images (mảng) cần có
//     features:(mảng) cần có
//     description:(hiện tại là mảng) cần cócó
//     price:{type:Number, required:true},
//     currency:{type:String, required:true},
//     discount:
//     color:mảng, cần có,
//     reviewsCount
//     ratingsCount
//     ratingsAvg
//Done
router.post('/', verifyUser, verifyRole('admin'), createProductControl); 


// Gọi ra brand và category
router.get("/brand", findBrandControl)
router.get("/category", findCategoryControl)
router.get("/page", findPageControl)
//Trả về số lượng sản phẩm và số lượng page được chia (mỗi page 5 cái) các 
//Lưu ý: Dùng để tạo thanh trang. B1: Áp filter để tìm sản phẩm để tìm page trước
//B2: Sử dụng để tạo thanh trang sau đó mới dùng filter đó tìm sản phẩm theo trang

router.get('/', findProductControl);  // Tim  kiếm thông qua query, tìm các trường thông tin của sản phẩm như
//search(tên),  category, features(một số chức năng), brand, dir(desc hoặc asc theo cột trong order),order, priceMax, priceMin
// VD: product/?search=iphone&features=choi-game&dir=desc&order=price?priceMax=20000000?priceMin=5000000?page=11

//Done
router.get("/:_id", findOneProductControl) // Tìm kiếm duy nhất 1 sản phẩm dựa theo id

router.delete('/:_id', verifyUser, verifyRole('admin'), deleteProductControl);// Xóa sản phẩm theo id
router.put('/:_id', verifyUser, verifyRole('admin'), updateProductControl);// update sản phẩm theo id


// Thay đổi các trường như trên get trong bodybody

module.exports = router