const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
   
    link: {
        type: String,
        required: true,
        unique: true 
    },
    description: {
        type: String
    },
    pubDate: { 
        type: Date
    }
}, {
    
    timestamps: true 
});

module.exports = mongoose.model('Job', JobSchema);