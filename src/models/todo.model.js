const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);