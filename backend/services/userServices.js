const mongoose = require('mongoose');
const User = require('../models/user');
const { deleteRating } = require('../services/ratingServices');
const{deleteCommentUser}= require('../services/commentServices')

async function getUsers(name = null, page = 1, limit = 20) {
    try {
        const query = name ? { name: new RegExp(name, 'i') } : {};
        const [users, total] = await Promise.all([
            User.find(query).skip((page - 1) * limit).limit(limit),
            User.countDocuments(query)
        ]);
        return { users, total };
    } catch (error) {
        throw error;
    }
}

async function getUserByObjectId(id) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        return await User.findById(objectId);
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        const user = await User.findById(objectId);
        if (!user) throw new Error('User not found');
        const data = { ...updateData };
        if (!('password' in updateData)) {
            Object.defineProperty(data, "password", { value: user.password });
        }
        return await User.findByIdAndUpdate(objectId, data, { new: true, runValidators: true });
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const objectId = new mongoose.Types.ObjectId(`${id}`);
        const userFound = await User.findByIdAndDelete(objectId);
        if (userFound) {
            deleteRating(id, "user")
            deleteCommentUser(id)
        }
        else {
            throw new Error("Chua tim duoc user hoac khong the xoa user")
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsers,
    getUserByObjectId,
    updateUser,
    deleteUser
}