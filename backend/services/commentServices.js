const Comment = require("../models/comment")
const Product = require("../models/product")
const mongoose = require("mongoose")
const { updateSearchIndex } = require("../models/rating")
const comment = require("../models/comment")

const createComment = async (userId, productId, comment)=> {
    try{
        const newCmt = await Comment.create({
            user:new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(productId),
            context: comment
        })
        if (!newCmt){
            throw new Error("Khong the tao duoc comment")
        }
        else{
            return newCmt
        }
    }
    catch(err){
        throw err
    }
    
}
const createAnswer = async (userId, productId, parentCommentId, replyContent) => {
    try {
        // 1. Tạo comment mới
        const replyComment = await Comment.create({
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(productId),
            context: replyContent
        });

        if (!replyComment) {
            throw new Error("Không thể tạo được câu trả lời");
        }

        // 2. Cập nhật comment cha để thêm _id của reply vào mảng answer
        const parent = await Comment.findByIdAndUpdate(
            parentCommentId,
            { $push: { answer: replyComment._id } },
            { new: true }
        );

        if (!parent) {
            throw new Error("Không tìm thấy comment cha để cập nhật");
        }

        return replyComment;

    } catch (err) {
        throw err;
    }
};


const updateComment = async (commentId, newComment) => {
    try {
        const commentFound = await Comment.findByIdAndUpdate(new mongoose.Types.ObjectId(commentId), {context: newComment}, {new:true, runValidators: true})
        if (!commentFound) {
            throw new Error("Khong the tim thay hoac update comment");
        }
        else{
            return commentFound
        }
    }
    catch(err){
        throw err
    }
    
}
// const deleteComment = async (objectId, objectType = "comment") => {
//     try{
//         let commentFound
//         if (objectType !== "comment"){
//             commentFound = Comment.deleteMany({
//                 [objectType]: new mongoose.Types.ObjectId(objectId)
//             })
//         }
//         else{
//             commentFound = Comment.findByIdAndDelete(new mongoose.Types.ObjectId(objectId))
//         }
//         if(!commentFound){
//             throw new Error("Khong tim duoc hoac khong xoa duoc")
//         }
//         else{
//             return commentFound
//         }
//     }
//     catch(err){
//         throw err
//     }
    
// }
const deleteComment = async (objectId, objectType = "comment") => {
    try {
        if (objectType !== "comment") {
            // 1. Tìm tất cả comment cần xóa theo user hoặc product
            const comments = await Comment.find({
                [objectType]: new mongoose.Types.ObjectId(objectId)
            });

            // 2. Đệ quy xóa từng comment và các reply của nó
            for (const comment of comments) {
                await deleteComment(comment._id, "comment");
            }

            return { deletedCount: comments.length };
        } else {
            // Xử lý xóa 1 comment và các reply
            const comment = await Comment.findById(objectId);
            if (!comment) {
                throw new Error("Không tìm thấy comment để xóa");
            }

            // Đệ quy xóa các comment con
            if (comment.answer && comment.answer.length > 0) {
                for (const replyId of comment.answer) {
                    await deleteComment(replyId, "comment");
                }
            }

            // Xóa comment chính
            const deleted = await Comment.findByIdAndDelete(objectId);
            return deleted;
        }
    } catch (err) {
        throw err;
    }
};

const getCommentById = async (commentId) => {
    try{
        return await Comment.findById(new mongoose.Types.ObjectId(commentId))
    }
    catch(err){
        throw err
    }
}
const getProductComment = async (productId, userId = null) => {
    try{
        const commentFound = await Comment.find({
            product: new mongoose.Types.ObjectId(productId)
        }).populate("user", "name _id")
        userId = userId ? userId.toString(): null
        
        if(commentFound){
            const result = commentFound.map(comment => {
                return {...comment.toObject(), 
                    fromUser: userId ?  userId === comment.user._id.toString() :false,
                    
                }
            })
            return result
        }
        else{
            throw new Error("Khong tim duoc rating cua san pham")
        }
        
    }
    catch(err){
        throw err
    }
}
module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getCommentById,
    getProductComment,
    createAnswer
}

