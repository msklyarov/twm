const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const config = require('config');

const app = express();
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/traits', require('./routes/api/traits'));
app.use('/api/treasury', require('./routes/api/treasury'));

const PORT = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(
    app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));