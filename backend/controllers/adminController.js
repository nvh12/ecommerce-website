require('dotenv').config();
const orderServices = require('../services/orderServices');
const userServices = require('../services/userServices');

async function getOrders(req, res) {
    try {
        let { page = 1, sortBy = null, order = 'asc' } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        const total = await orderServices.getOrderNumber();
        if (total === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No orders found'
            });
        }
        const orders = await orderServices.getAllOrders(page, 20, sortBy, order);
        res.status(200).json({
            totalPages: Math.ceil(total / 20),
            page: page,
            order: order,
            data: orders || [],
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message || 'Something went wrong' });
    }
}

async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const { updateData } = req.body;
        const order = await orderServices.updateOrder(id, updateData);
        res.status(200).json({ status: 'success', order: order });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

async function getUsers(req, res) {
    try {
        const { name } = req.query;
        const user = await userServices.getUsers(name);
        res.status(200).json({ status: 'success', user: user })
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

async function getUserOrders(req, res) {
    try {
        let { id, page = 1, sortBy = null, order } = req.query;
        page = parseInt(page);
        if (Number.isNaN(page) || page < 1) page = 1;
        const total = await orderServices.getOrderNumber(id);
        if (total === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No orders found'
            });
        }
        const orders = await orderServices.getOrdersByUser(id, page, 20, sortBy, order);
        res.status(200).json({
            totalPages: Math.ceil(total / 20),
            page: page,
            order: order,
            data: orders || [],
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
}

module.exports = {
    getUsers,
    getOrders,
    updateOrder,
    getUserOrders 
};