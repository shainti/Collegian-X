const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.route')
const cors = require('cors');

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.get("/", (req, res, next) => {
  res.send('Hello');
});
app.use('/api/auth', authRoutes);

module.exports = app;
