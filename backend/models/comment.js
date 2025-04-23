const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    context: {type:String, required: true},

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }

})

module.exports = mongoose.model('Comment', commentSchema, 'comment')