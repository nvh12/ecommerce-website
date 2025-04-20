const Product = require("../models/product");

const createProduct = async (info) =>{
    return await Product.create({...info});
}

const findProduct = async (info)=>{
    const {_id, search,  category, features, brand, dir,order, priceMax, priceMin} = info
    filter = {}
    if (_id) filter._id = new mongoose.Types.ObjectId(`${_id}`)
    if (search) filter.productName = {$regex:search, $options: 'i'}
    if (category) filter.category = category
    if (features){
        filter.features = Array.isArray(features) ? { $all: features } : features
    }  
    if (brand) filter.brand = brand
    let sort = {};
    if (order) {
        sort[order] = dir === 'desc' ? -1 : 1;
    }
    if(priceMin || priceMax){
        filter.price = {};
        if (priceMin) filter.price.$gte = priceMin;
        if (priceMax) filter.price.$lte = priceMax;
    }
    
    return await Product.find(filter).sort(sort)
}

const deleteProduct = async (info)=>{
    const {_id} = info
    return await Product.findByIdAndDelete(new mongoose.Types.ObjectId(`${_id}`))
}

const updateProduct = async (info, updateData)=>{
    const {_id} = info
    return await Product.findByIdAndUpdate(new mongoose.Types.ObjectId(`${_id}`),updateData, { new: true, runValidators: true } )
}
module.exports ={
    createProduct,
    findProduct,
    deleteProduct,
    updateProduct
}