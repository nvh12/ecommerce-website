const mongoose = require('mongoose')
const {Brand, Category} = require('../models/index')

const addIndex = async(brand, category) => {
    try{
        if(brand){
            await Brand.findOneAndUpdate(
                { name: brand },
                {},
                { upsert: true, new: true, setDefaultsOnInsert: true }
              );
        }
        if (category){
            await Category.findOneAndUpdate(
                {name : category},
                {},
                {upsert: true, new : true, setDefaultsOnInsert: true}
            )
        }
    }
    catch(err){
        throw err
    }
    
}
const findBrand = async () => {
    try{
        return await Brand.find().sort({ name: 1 })
    }
    catch(err){
        throw err
    }
    
}
const findCategory = async () =>{
    try{
        return await Category.find().sort({ name: 1 })
    }
    catch(err){
        throw err
    }
    
}
module.exports = {
    addIndex,
    findBrand,
    findCategory
}