const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const reservations = require('./routes/reservations');
const comments = require('./routes/comments');
const auth = require('./routes/auth');
// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Routes files
const restaurants = require('./routes/restaurants');



const app = express();

// Body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());


// Mount Router
app.use('/api/auth',auth);
app.use('/api/restaurants', restaurants);
app.use('/api/reservations',reservations);
app.use('/api/comments',comments);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log("Server running in " + process.env.NODE_ENV + " mode on port " + PORT));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});