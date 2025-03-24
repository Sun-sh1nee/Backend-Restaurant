const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("../config/db"); // Adjusted path
const reservations = require("../routes/reservations");
const comments = require("../routes/comments");
const auth = require("../routes/auth");
const restaurants = require("../routes/restaurants");
const cors = require("cors");

dotenv.config({ path: "./config/config.env" });



// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mount Routes
app.use("/api/auth", auth);
app.use("/api/restaurants", restaurants);
app.use("/api/reservations", reservations);
app.use("/api/comments", comments);

module.exports = app;