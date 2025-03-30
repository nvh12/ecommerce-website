const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        required: true, 
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
    ratings:{type:Number,default:0},
    discount:{type:Number, default:0},
    size :[{type:String}],
    color:[{type:String}],
   
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'Products');