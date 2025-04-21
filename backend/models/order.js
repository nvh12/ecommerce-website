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
    address: { 
        type: String, 
        validate: {
            validator: function(v) {
                return this.delivery === 'store' || (this.delivery === 'delivery' && v);
            },
            message: props => 'Address is required for delivery orders.'
        }
    },
    status: { type: String, enum: ['processing', 'completed', 'cancelled'], required: true }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    this.total_price = this.item.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Order', orderSchema, 'Orders');