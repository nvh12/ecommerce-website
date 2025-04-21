const mongoose = require('mongoose');
const Cart = require('../models/cart');

async function getCart(userId) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
        return await Cart.findOne({ user: userObjectId }).populate('items.product');
    } catch (error) {
        throw error;
    }
}

async function addItem(item, userId) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
        const itemId = new mongoose.Types.ObjectId(`${item.id}`);
        let cart = await Cart.findOne({ user: userObjectId });
        if (!cart) {
            cart = new Cart({ user: userObjectId, items: [], total_price: 0 });
        }
        const existingItem = cart.items.find((it) => it.product.equals(itemId));
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({ product: itemId, price: item.price, quantity: 1 });
        }
        cart.total_price += item.price;
        return await cart.save();
    } catch (error) {
        throw error;
    }
}

async function reduceItem(item, userId) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
        const itemId = new mongoose.Types.ObjectId(`${item.id}`);
        let cart = await Cart.findOne({ user: userObjectId });
        if (!cart) {
            cart = new Cart({ user: userObjectId, items: [], total_price: 0 });
        }
        const existingItem = cart.items.find((it) => it.product.equals(itemId));
        if (existingItem) {
            if (existingItem.quantity > 0) {
                existingItem.quantity--;
                cart.total_price -= item.price;
            } else {
                removeItem(item, userId);
            }
        }
        return await cart.save();
    } catch (error) {
        throw error;
    }
}

async function removeItem(item, userId) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
        const itemId = new mongoose.Types.ObjectId(`${item.id}`);
        const cart = await Cart.findOne({ user: userObjectId });
        if (!cart) throw new Error('Cart not found');
        const itemIndex = cart.items.findIndex((it) => it.product.equals(itemId));
        if (itemIndex === -1) throw new Error('Item not found in cart');
        const removedItem = cart.items[itemIndex];
        const itemTotal = removedItem.price * removedItem.quantity;
        cart.items = cart.items.filter((it) => !it.product.equals(itemId));
        cart.total_price = Math.max(0, cart.total_price - itemTotal);
        return await cart.save();
    } catch (error) {
        throw error;
    }
}

async function clearCart(userId) {
    try {
        const userObjectId = new mongoose.Types.ObjectId(`${userId}`);
        const cart = await Cart.findOne({ user: userObjectId });
        if (!cart) throw new Error('Cart not found');
        return await Cart.findOneAndDelete({ user: userObjectId});
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCart,
    addItem,
    reduceItem, 
    removeItem,
    clearCart
}