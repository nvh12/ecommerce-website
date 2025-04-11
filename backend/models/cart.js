const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch', required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema, 'Carts');