const Comment = require("../models/comment")
const commentServices = require("../services/commentServices")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ACCESS_SECRET = process.env.JWT_SECRET;

const getCommentProductControl = async (req, res) =>{
    try{
        const {productId} = req.params
        const {page, limit} = req.query
        
        let userId
        if(req.cookies.accessToken){
            const accessToken = req.cookies.accessToken
            const decode = jwt.verify(accessToken, ACCESS_SECRET)
            userId = decode.id;
        }
        else{
            userId = null
        }
        const commentProduct = await commentServices.getProductComment({userId, productId, limit,page})
        if (commentProduct){
            res.status(200).json({message:"Success", commentProduct})
        }
        else {
            res.status(404).json({ message: "không tìm thấy comment của sản phẩm" });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khong load cmt duoc, controller", error: err.message})
    }
}
const createAnswerControl = async (req, res) => {
    try {
        const { parentCommentId, productId, replyContent } = req.body;
        let userId;

        if (req.cookies.accessToken) {
            const accessToken = req.cookies.accessToken;
            const decode = jwt.verify(accessToken, ACCESS_SECRET);
            userId = decode.id;
        } else {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
        }

        const newAnswer = await commentServices.createAnswer(userId, productId, parentCommentId, replyContent);
        
        if (newAnswer) {
            res.status(200).json({ message: "Tạo phản hồi thành công", newAnswer });
        } else {
            res.status(404).json({ message: "Không thể tạo phản hồi" });
        }
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tạo phản hồi, controller", error: err.message });
    }
};


const deleteCommentControl = async (req, res) =>{
    try{
        const {commentId} = req.params
        
        
        const deletedComment = await commentServices.deleteComment(commentId)
        if (deletedComment){
            res.status(200).json({message:"Success", deletedComment})
        }
        else {
            res.status(404).json({ message: "không tìm thấy comment để xóa" });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khong xoa cmt duoc, controller", error: err.message})
    }
}

const updateCommentControl = async (req, res)=>{
    try{
        const {commentId} = req.params
        const {newComment} = req.body
        
        const updatedComment = await commentServices.updateComment(commentId, newComment)
        if (updatedComment){
            res.status(200).json({message:"Success", updatedComment})
        }
        else {
            res.status(404).json({ message: "không tìm thấy comment để update " });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khong update cmt duoc, controller", error: err.message})
    }
}

const createCommentControl = async (req, res) =>{
    try{

        const {comment,productId} = req.body
        let userId
        if(req.cookies.accessToken){
            const accessToken = req.cookies.accessToken
            const decode = jwt.verify(accessToken, ACCESS_SECRET)
            userId = decode.id;
        }
        else{
            userId = null
        }
        const newComment = await commentServices.createComment(userId,productId, comment)
        if (newComment){
            res.status(200).json({message:"Success", newComment})
        }
        else {
            res.status(404).json({ message: "không tạo được comment mới" });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khong tạo  cmt duoc, controller", error: err.message})
    }
}

const getCommentByIdControl = async (req, res) => {
    try{
        const {commentId} = req.params
        const foundComment = await commentServices.getCommentById(commentId)
        if(foundComment){
            res.status(200).json({message:"Success", foundComment})
        }
        else{
            res.status(404).json({ message: "Không tồn tại comment trên hoặc comment đã bị xóa" });
        }
    }
    catch(err){
        res.status(500).json({message:"Loi khong tim duoc cmt nay, controller", error: err.message})
    }
}
const findCommentPageControl = async(req, res) =>{
    try{
        const {limit} = req.query
        const {productId} = req.params
        

        const page = await commentServices.getCommentTotalPages({productId, limit})
        if(!page){
            res.status(404).json({message:"Can not find comment page"})
        }
        else{
            res.status(200).json({message:"Success", page})
        }
    }
    catch(err){
        res.status(500).json({message:err.message, err});
    }
}
module.exports ={
    getCommentProductControl,
    deleteCommentControl,
    updateCommentControl,
    createCommentControl,
    getCommentByIdControl,
    createAnswerControl,
    findCommentPageControl
}