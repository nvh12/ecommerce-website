const Comment = require("../models/comment")
const Product = require("../models/product")
const mongoose = require("mongoose")



const createComment = async (userId, productId, comment) => {
    try {
        const filter = {
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(productId),
            reply: false
        };

        const existingComment = await Comment.findOne(filter);

        let updatedComment;

        if (existingComment) {
            // Cập nhật comment cũ
            existingComment.context = comment;
            updatedComment = await existingComment.save();
        } else {
            // Tạo mới comment
            updatedComment = await Comment.create({
                user: filter.user,
                product: filter.product,
                context: comment,
                reply: false
            });

            // Tăng số lượng review cho product
            await Product.findByIdAndUpdate(
                filter.product,
                { $inc: { reviewsCount: 1 } }
            );
        }

        return updatedComment;
    } catch (err) {
        throw err;
    }
};

const createAnswer = async (userId, productId, parentCommentId, replyContent) => {
    try {
        // 1. Tạo comment mới
        const replyComment = await Comment.create({
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(productId),
            context: replyContent,
            reply: true,
            parent: new mongoose.Types.ObjectId(parentCommentId)
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
        await Product.findByIdAndUpdate(
                new mongoose.Types.ObjectId(productId),
                { $inc: { reviewsCount: 1 } }
            )

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

const deleteCommentById = async (cmtId) => {
    try{
        let deleteCount = 0
        const comment=  await Comment.findById(new mongoose.Types.ObjectId(cmtId))
        if (comment && comment.answer.length > 0) {
                for (const replyId of comment.answer) {
                    deleteCount = deleteCount + await deleteCommentById(replyId);
                }
            }
        await Comment.findByIdAndDelete(new mongoose.Types.ObjectId(cmtId))
        return deleteCount + 1
    }
    catch(err){
        throw err
    }
}

const deleteComment = async (objectId, objectType = "comment") => {
    try {
        let deleteCount = 0;

        if (objectType === "product") {
            // Nếu là product, tìm tất cả comment gốc (reply: false) của sản phẩm
            const comments = await Comment.find({
                product: new mongoose.Types.ObjectId(objectId),
                reply: false  // Lọc chỉ lấy comment gốc
            });

            for (const comment of comments) {
                // Xóa tất cả các reply của comment này
                deleteCount += await deleteCommentById(comment._id);
            }
            return { deleteCount };
        }

        if (objectType === "comment") {
            const comment = await Comment.findById(objectId);
            if (!comment) {
                throw new Error("Không tìm thấy comment");
            }

            // Nếu là comment gốc (reply: false), xóa trực tiếp comment đó
            if (comment.reply === true) {
                await Comment.updateOne(
                    { _id: new mongoose.Types.ObjectId(comment.parent), answer: comment._id },
                    { $pull: { answer: comment._id } },
                    { safe: true }
                );
            } 
            // Xóa comment gốc và các reply nếu có
            deleteCount += await deleteCommentById(comment._id);

            // Cập nhật lại số lượng comment cho sản phẩm sau khi xóa
            await Product.findByIdAndUpdate(
                new mongoose.Types.ObjectId(comment.product),
                { $inc: { reviewsCount: -deleteCount } }
            );

            return { deleteCount };
        }

    } catch (err) {
        throw err;
    }
};
const deleteCommentUser = async (userId) => {
    try {
        const comments = await Comment.find({ user: new mongoose.Types.ObjectId(userId) });

        if (comments.length > 0) {
            await Promise.all(
                comments.map(comment =>
                    deleteComment(comment._id, "comment").catch(err => {
                        if (err.message !== "Không tìm thấy comment") {
                            throw err; // Các lỗi khác vẫn bị ném ra
                        }
                        // Nếu là lỗi "Không tìm thấy comment", bỏ qua và return null
                        return null;
                    })
                )
            );
        }
    } catch (err) {
        throw err;
    }
};



const getCommentById = async (commentId) => {
    try{
        return await Comment.findById(new mongoose.Types.ObjectId(commentId)).populate("user", "name _id")
    }
    catch(err){
        throw err
    }
}

const getProductComment = async (info) => {
    try {
        let {productId, userId, page = 1, limit= 5} = info
        const skip = (page - 1) * limit;
        userId = userId ? userId.toString() : null;

        let userComment = null;
        let comments = [];

        if (page == 1 && userId) {
            // 1. Lấy comment của người dùng (nếu có)
            userComment = await Comment.findOne({
                product: new mongoose.Types.ObjectId(productId),
                user: new mongoose.Types.ObjectId(userId),
                reply:false
            }).populate("user", "name _id");

            // 2. Lấy các comment khác, loại trừ comment của user
            const query = {
                reply:false,
                product: new mongoose.Types.ObjectId(productId)
                // reply: false // đặt rõ ràng thay vì chèn conditionally
            };

            if (userComment) {
                query.user = { $ne: new mongoose.Types.ObjectId(userId) };
            }


            comments = await Comment.find(query)
                .skip(0) // Giảm 1 nếu đã lấy comment user rồi
                .limit(userComment ? limit - 1 : limit)
                .populate("user", "name _id");

        } else {
            // Các trang khác: chỉ lấy các comment khác
            const query = {
                product: new mongoose.Types.ObjectId(productId),
                ...(userId && { user: { $ne: new mongoose.Types.ObjectId(userId) } }),
                reply:false
            };

            comments = await Comment.find(query)
                .skip(skip)
                .limit(limit)
                .populate("user", "name _id");
        }

        // Gộp comment user (nếu có) vào đầu
        const allComments = userComment ? [userComment, ...comments] : comments;

        const result = allComments.map(comment => ({
            ...comment.toObject(),
            fromUser: userId ? userId === comment.user._id.toString() : false,
        }));

        return result;

    } catch (err) {
        throw err;
    }
};

const getCommentTotalPages = async (info) => {
    try {
        const {productId, limit = 5} = info
        const total = await Comment.countDocuments({
            product: new mongoose.Types.ObjectId(productId),
            reply:false
        });
        const totalPages = Math.ceil(total / limit);
        return {
            total,
            totalPages}
        ;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getCommentById,
    getProductComment,
    createAnswer,
    getCommentTotalPages,
    deleteCommentUser
}

