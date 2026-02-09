const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route');
const facultyRoutes = require('./routes/faculty.route');
const studentRoutes = require('./routes/student.route');
const cors = require('cors');
const path = require('path')
require("dotenv").config();


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res, next) => {
});
app.use('/api/Student',studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/Faculty',facultyRoutes);

module.exports = app;
