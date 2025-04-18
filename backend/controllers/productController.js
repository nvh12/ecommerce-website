const Product = require("../models/product")
const {
    createProduct,
    findProduct,
    deleteProduct,
    updateProduct
} = require("../services/productServices")
const mongoose = require('mongoose')

// CRUD product
const createProductControl = async (req, res) =>{
    try{
        // const data = req.body;
        const product =  await createProduct(req.body);
        if(!product){
            res.status(500).json({message:"Can not add product"})
        }
        else{
            res.status(200).json({message:"Success", product:product})
        }
    }
    catch(err){
        res.status(500).json({message:err.message,err:err})
    }
}

const findProductControl = async (req, res) => {
    try{
        const { id, ...rest } = { ...req.params, ...req.query }
        const filters = { ...rest }
        if (id) {
            filters._id = new mongoose.Types.ObjectId(`${id}`)
        }
        const product = await findProduct(filters)
        if(!product){
            res.status(404).json({message:"Can not find product"})
        }
        else{
            res.status(200).json({message:"Success", product})
        }
    }
    catch(err){
        res.status(500).json({message:err.message, err});
    }
}
const deleteProductControl = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await deleteProduct(id);

        if (!deleted) {
            return res.status(404).json({ message: "Product not found or already deleted" });
        }

        res.status(200).json({ message: "Product deleted successfully", deleted });
    } catch (err) {
        res.status(500).json({ message: err.message, err });
    }
};

const updateProductControl = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await updateProduct(id, updateData);

        if (!updated) {
            return res.status(404).json({ message: "Product not found or update failed" });
        }

        res.status(200).json({ message: "Product updated successfully", updated });
    } catch (err) {
        res.status(500).json({ message: err.message, err });
    }


};

module.exports = {
    createProductControl,
    findProductControl,
    deleteProductControl,
    updateProductControl
}
