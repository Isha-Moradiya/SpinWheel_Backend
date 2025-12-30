const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const responseHandler = require('./middleware/responseHandler');
const router = require("./routes/index");

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

app.use(express.static(path.join(__dirname, 'public')));

// For all other routes, serve frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom response handler
app.use(responseHandler);

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api', router);

// Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.success({
//         message: 'Server is running',
//         data: {
//             timestamp: new Date().toISOString(),
//             uptime: process.uptime(),
//             environment: process.env.NODE_ENV || 'development'
//         }
//     });
// });

app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running on port: ${PORT}`);
});


module.exports = app;