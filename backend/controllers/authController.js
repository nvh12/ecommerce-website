require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(id) {
    return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(id) {
    return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '6h' })
}

async function register(req, res) {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({
            $or: [{ email: identifier }, { name: identifier }]
        });
        if (!user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, 
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 6 * 60 * 60 * 1000
        })
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
    try {
        const user = jwt.verify(refreshToken, REFRESH_SECRET);
        const accessToken = generateAccessToken(user.id); 
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, 
        })
        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

function logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    refresh,
    logout
};