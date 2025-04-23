const express = require("express")
const ratingController = require("../controllers/ratingController")
const router = express.Router();
//Tìm kiếm rating của một sản phẩm, kết quả rating trả về ngoài các trường rating trong model thì
//có kèm thêm trường fromUser: true nếu đó là rating của người dùng. Việc này nhờ front-end chú ý để
// xây giao diện có phần update và delete cho riêng rating có trường này là truetrue
router.get("/:productId", ratingController.findRatingControl)

//Update rating theo id
// Yêu cầu đầu vào : id ở params và rate trong body
router.put("/update/:id", ratingController.updateRatingControl)
// Tạo rating mới. Yêu cầu đầu vào có các trường productId, userId và rate trong body
router.post("/create", ratingController.createRatingControl)
// Xóa rating. Yêu cầu đầu vào là id trong params
router.delete("/delete/:id", ratingController.deleteRatingControl)
//Tìm rating theo id. Yêu cầu đầu vào là ratingId ở params
router.get("/id/:ratingId", ratingController.findRatingByIdControl)