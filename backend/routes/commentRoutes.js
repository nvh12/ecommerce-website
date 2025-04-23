const express = require("express")
const commentController = require("../controllers/commentController")
const router = express.Router();

// Tìm comment của sản phẩm, trả về các comment + 1 trường fromUser và + trường user là object có 2 trường 
//name và _id
// Đang test nên đã cho tạm userIduserId
//Intput: productId ở params
//Done
router.get("/:productId", commentController.getCommentProductControl)

//Update rating theo id
// Yêu cầu đầu vào : productId ở params và newComment trong body
//Done
router.put("/update/:commentId",commentController.updateCommentControl)


// Tạo rating mới.  
// Có thể sử dụng để update
// Yêu cầu đầu vào: productId và comment trong body, userId lấy từ cookies
// Trong quá trình test chưa có userId có sẵn
//Done
router.post("/create", commentController.createCommentControl)

// Xóa rating. Yêu cầu đầu vào là id trong params
// Yêu cầu đầu vào: commentId ở params 
//Done
router.delete("/delete/:commentId", commentController.deleteCommentControl)


//Tìm rating theo id. Yêu cầu đầu vào là commentId ở params
//Done
router.get("/id/:commentId", commentController.getCommentByIdControl)

module.exports = router