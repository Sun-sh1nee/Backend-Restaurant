const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reserDate: {
        type:Date,
        required:true
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    nameUser: {
        type: String,
        require: true
    },
    restaurant:{
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Reservation',ReservationSchema);