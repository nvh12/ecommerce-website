const Product = require("../models/product");

const createProduct = async (info) =>{
    return await Product.create({...info});
}

const findProduct = async (info)=>{
    return await Product.find({...info})
}

const deleteProduct = async (info)=>{
    const {id} = info
    return await Product.findByIdAndDelete(id)
}

const updateProduct = async (info, updateData)=>{
    const {id} = info
    return await Product.findByIdAndUpdate(id,updateData, { new: true, runValidators: true } )
}
module.exports ={
    createProduct,
    findProduct,
    deleteProduct,
    updateProduct
}