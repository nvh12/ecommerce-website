const Cart = require('../models/cart');

async function getCart(userId) {
    try {
        return await Cart.findOne({ user: userId });
    } catch (error) {
        throw error;
    }
}

async function addItem(item, userId) {
    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [], total_price: 0 });
        }
        const existingItem = cart.items.find((it) => it.product.toString() === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({ product: item.id, price: item.price, quantity: 1 });
        }
        cart.total_price += item.price;
        return await cart.save();
    } catch (error) {
        throw error;
    }
}

async function removeItem(item, userId) {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');
        const itemIndex = cart.items.findIndex((it) => it.product.toString() === item.id);
        if (itemIndex === -1) throw new Error('Item not found in cart');
        const removedItem = cart.items[itemIndex];
        const itemTotal = removedItem.price * removedItem.quantity;
        cart.items = cart.items.filter((it) => it.product.toString() !== item.id);
        cart.total_price = Math.max(0, cart.total_price - itemTotal);
        return await cart.save();
    } catch (error) {
        throw error;
    }
}

async function clear(userId) {
    try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');
        return await Cart.findOneAndDelete({ user: userId});
    } catch (error) {
        throw error;
    }
}