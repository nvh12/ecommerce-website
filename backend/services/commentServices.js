const Comment = require("../models/comment")
const Product = require("../models/product")
const mongoose = require("mongoose")
const { updateSearchIndex } = require("../models/rating")
const comment = require("../models/comment")

const createComment = async (userId, productId, comment)=> {
    try{
        const newCmt = await Comment.create({
            user:mongoose.Types.ObjectId(userId),
            product: mongoose.Types.ObjectId(productId),
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
        const commentFound = await Comment.findByIdAndUpdate(mongoose.Types.ObjectId(commentId), {context: newComment}, {new:true, runValidators: true})
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
                [objectType]: mongoose.Types.ObjectId(objectId)
            })
        }
        else{
            commentFound = Comment.findByIdAndDelete(mongoose.Types.ObjectId(objectId))
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
const getCommentById = async (commnetId) => {
    try{
        return await Comment.findById(mongoose.Types.ObjectId(commentId))
    }
    catch(err){
        throw err
    }
}
const getProductComment = async (productId, userId = null) => {
    try{
        const commentFound = await Comment.find({
            product: mongoose.Types.ObjectId(productId)
        })
        if(commentFound){
            const result = commentFound.map(comment => {
                return {...comment, 
                    fromUser: userId ?  mongoose.Types.ObjectId(userId) === comment.user :false
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

