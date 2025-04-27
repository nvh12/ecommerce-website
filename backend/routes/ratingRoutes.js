const express = require("express")
const ratingController = require("../controllers/ratingController")
const { verifyUser } = require("../middleware/authMiddleware")
const router = express.Router();



router.use(verifyUser)
//Tìm kiếm rating của một sản phẩm, kết quả rating trả về ngoài các trường rating trong model thì
//có kèm thêm trường fromUser: true nếu đó là rating của người dùng. Việc này nhờ front-end chú ý để
// xây giao diện có phần update và delete cho riêng rating có trường này là true
// đang test nên cho tạm userId = "67e90ba169f6b16b579ceecb"
//Done
router.get("/:productId",verifyUser, ratingController.findRatingControl)

//Update rating theo id
// Yêu cầu đầu vào : ratingId ở params và rate trong body
//Done
router.put("/update/:ratingId", ratingController.updateRatingControl)

// Tạo rating mới. Yêu cầu đầu vào có các trường productId và rate trong body, userId lấy từ cookies 
// Trong quá trình test chưa có userId thì sẽ cho tạm nó là "67e90ba169f6b16b579ceecb"
// Có thể sử dụng để updatee
//Done
router.post("/create",verifyUser, ratingController.createRatingControl)


// Xóa rating. Yêu cầu đầu vào là ratingId trong params
//Done
router.delete("/delete/:ratingId", ratingController.deleteRatingControl)


//Tìm rating theo id. Yêu cầu đầu vào là ratingId ở params
//Done
router.get("/id/:ratingId", ratingController.findRatingByIdControl)

module.exports = router