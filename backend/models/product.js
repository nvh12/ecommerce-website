const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    stocks:{type:Number, default:0},
    category: [{ 
        type: String, 
        required: true, 
    }],
    brand:{
        type:String
    },
    images:[
        {type:String,
        required:true,
        default:'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
        }
    ],
    features:[{
        type:String,
    }],
    description:{
        type:String, required: true,
    },
    price:{type:Number, required:true},
    currency:{type:String, required:true},

    ratings:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    discount:{type:Number, default:0},
    color:[{type:String}],
    reviews_count:{type:Number, default:0},
    ratings_count:{
        type:Number,
        default:0
    },
    rating_avg:{
        type:Number,
        default: 0
    }
   
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'Products');