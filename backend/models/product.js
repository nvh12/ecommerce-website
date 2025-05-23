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
    discount:{type:Number, default:0},
    color:[{type:String}],
    reviewsCount:{type:Number, default:0},
    ratingsCount:{
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
        total: {type:Number, default:0}

    },
    ratingsAvg:{
        type:Number,
        default: 0
    }
   
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'Products');