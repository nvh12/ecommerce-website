const Rating = require("../models/rating")
const ratingServices = require("../services/ratingServices")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_SECRET = process.env.JWT_SECRET;

const createRatingControl = async (req, res) =>{
    try{
        let userId
        const { productId, rate} = req.body
        if(req.cookies.accessToken){
            const accessToken = req.cookies.accessToken
            const decode = jwt.verify(accessToken, ACCESS_SECRET)
            userId = decode.id;
        }
        else{
            userId ="67e90ba169f6b16b579ceecb"
        }
        if (!userId || !productId || !rate) {
            return res.status(400).json({ message: "Thiếu thông tin userId, productId hoặc rate" });
        }
        const newRating = await ratingServices.createRating(userId, productId, rate)
        if (!newRating){
            res.status(500).json({message:"Khong tao duoc rating"})
        }
        else{
            res.status(200).json({message:"Tao rating thanh cong", newRating:newRating})
        }
    }
    catch(err){
        res.status(500).json({message:"Loi tao rating", error: err.message})
    }
}

const findRatingControl = async (req, res) => {
    try{
        const {productId} = req.params
        let userId
        if(req.cookies.accessToken){
            const accessToken = req.cookies.accessToken
            const decode = jwt.verify(accessToken, ACCESS_SECRET)
            userId = decode.id;
        }
        else{
            userId = "67e90ba169f6b16b579ceecb"
        }
        const ratings = await ratingServices.getRatingProduct(productId, "67e90ba169f6b16b579ceecb",false);
        if (!ratings) {
            res.status(404).json({ message: "Không tìm thấy đánh giá nào cho sản phẩm này" });
        } else {
            res.status(200).json({ message: "Tìm thấy đánh giá", ratings });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khi tim rating cua san pham ", error:err.message})
    }
}
const findRatingByIdControl = async (req, res) => {
    try {
        const { ratingId } = req.params;

        // Tìm rating theo ratingId
        const rating = await ratingServices.getRatingById(ratingId);

        if (!rating) {
            return res.status(404).json({ message: "Không tìm thấy rating này" });
        }

        res.status(200).json({ message: "Tìm thấy rating", rating });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tìm rating", error: err.message });
    }
};


const updateRatingControl = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rate } = req.body;  

        if (!rate) {
            return res.status(400).json({ message: "Thiếu thông tin rate để cập nhật" });
        }

        
        const updatedRating = await ratingServices.updateRating(ratingId, rate);
        
        if (!updatedRating) {
            return res.status(404).json({ message: "Không tìm thấy rating cần cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật rating thành công", updatedRating });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật rating", error: err.message });
    }
};

const deleteRatingControl = async (req, res) => {
    try {
        const { ratingId } = req.params;

        
        const deletedRating = await ratingServices.deleteRating(ratingId);

        if (!deletedRating) {
            return res.status(404).json({ message: "Không tìm thấy rating cần xóa" });
        }

        res.status(200).json({ message: "Xóa rating thành công", deletedRating });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa rating", error: err.message });
    }
};

module.exports = {
    createRatingControl,
    findRatingControl,
    updateRatingControl,
    deleteRatingControl,
    findRatingByIdControl
};