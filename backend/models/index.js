const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    quantity: {type:Number, default:0}
})
const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    quantity:{type:Number, default: 0}
})

module.exports = {
    Brand: mongoose.model('Brand', brandSchema, 'Brand'),
    Category: mongoose.model('Category', categorySchema, 'Category')
}