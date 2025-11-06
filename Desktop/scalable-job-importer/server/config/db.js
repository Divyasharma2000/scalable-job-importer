const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/job-importer-db';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;