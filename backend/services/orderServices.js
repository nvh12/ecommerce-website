const mongoose = require('mongoose');
const Order = require('../models/order');

async function getOrder(id) {
    try {
        const orderId = new mongoose.Types.ObjectId(`${id}`);
        return await Order.findById(orderId);
    } catch (error) {
        throw error;
    }
}

async function getAllOrders(page = 1, limit = 20, sortBy = null, order = 'asc') {
    try {
        const sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'asc' ? 1 : -1;
        } else {
            sortOption['createdAt'] = -1;
        }
        return await Order.find()
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw error;
    }
}

async function getOrdersByUser(userId, page = 1, limit = 20, sortBy = null, order = 'asc') {
    try {
        const sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'asc' ? 1 : -1;
        } else {
            sortOption['createdAt'] = -1;
        }
        const id = new mongoose.Types.ObjectId(`${userId}`);
        return await Order.find({ user: id })
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);
    } catch (error) {
        throw error;
    }
}

async function getOrderNumber(userId='') {
    try {
        if (userId) {
            const id = new mongoose.Types.ObjectId(`${userId}`);
            return await Order.countDocuments({user: id});
        } else {
            return await Order.countDocuments({});
        }
    } catch (error) {
        throw error;
    }
}

async function updateOrder(id, updateData) {
    try {
        const orderId = new mongoose.Types.ObjectId(`${id}`);
        return await Order.findOneAndUpdate(
            { _id: orderId },         
            updateData,
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderNumber,
    updateOrder
}