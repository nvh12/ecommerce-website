const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: Number, required: true },
    payment: { type: String, enum: ['cash', 'QR'], required: true },
    delivery: { type: String, enum: ['store', 'delivery'], required: true },
    address: { type: String },
    status: { type: String, enum: ['processing', 'completed', 'cancelled'], required: true }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    this.total_price = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (this.delivery === 'delivery' && (!this.address || this.address.trim() === '')) {
        return next(new Error('Address is required for delivery orders.'));
    }
    next();
});

orderSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.delivery === 'delivery' && (!update.address || update.address.trim() === '')) {
        return next(new Error('Address is required for delivery orders.'));
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema, 'Orders');