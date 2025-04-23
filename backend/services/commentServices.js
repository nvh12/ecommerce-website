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
const deleteComment = async (objectId, objectType = "comment") => {
    try{
        let commentFound
        if (objectType !== "comment"){
            commentFound = Comment.deleteMany({
                [objectType]: new mongoose.Types.ObjectId(objectId)
            })
        }
        else{
            commentFound = Comment.findByIdAndDelete(new mongoose.Types.ObjectId(objectId))
        }
        if(!commentFound){
            throw new Error("Khong tim duoc hoac khong xoa duoc")
        }
        else{
            return commentFound
        }
    }
    catch(err){
        throw err
    }
    
}
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
    getProductComment
}

