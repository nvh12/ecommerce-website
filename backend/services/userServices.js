const User = require('../models/user');

async function getUserById(id) {
    return await User.getUserById({ user_id: id });
}

async function createUser(info) {
    let user = new User({ ...info });
    await user.save;
}

async function updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}

module.exports = {
    getUserById,
    createUser,
    updateUser,
    deleteUser
}