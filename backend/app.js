const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
    origin: process.env.FRONT_URI,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/', homeRoutes);
app.use('/auth', authRoutes);

module.exports = app;
