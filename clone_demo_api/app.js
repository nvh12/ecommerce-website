const express = require("express");
const dotenv = require('dotenv')
const app = express();
const cors = require('cors')

app.use(cors())
//middleware
app.use(express.json());

const studentRouter = require("./routes/StudentRoutes");
app.use("/", studentRouter);
dotenv.config();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;

const mongoose = require("mongoose");

const queryString = process.env.MONGODB_URI ;

//configure mongoose
mongoose.connect(queryString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
    .catch(err => console.log('MongoDB connection error:', err.message));