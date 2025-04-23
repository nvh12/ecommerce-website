const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rate:{
        type: Number,
        max:5,
        min:1,
        required: true
    },
    product:{
        type :mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }
},{timestamps: true});

module.exports = mongoose.model('Rating', ratingSchema, 'rating');