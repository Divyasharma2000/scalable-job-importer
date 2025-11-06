const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    importDateTime: { type: Date, default: Date.now },
    totalFetched: { type: Number, required: true, default: 0 },
    newJobs: { type: Number, default: 0 },      
    updatedJobs: { type: Number, default: 0 },  
    failedJobs: { type: Number, default: 0 },   
    status: { type: String, default: 'Processing' }
});

module.exports = mongoose.model('ImportLog', ImportLogSchema);