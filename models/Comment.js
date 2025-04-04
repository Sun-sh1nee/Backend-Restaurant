const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    imagesUser: {
        type: String,
        require: false
    },
    nameUser: {
        type: String,
        require: false
    },
    restaurant:{
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    comment: {
        type: String,
        required: [true, 'your comment'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment',CommentSchema);