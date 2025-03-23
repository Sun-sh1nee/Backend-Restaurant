const req = require('express/lib/request');
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    tel: {
        type: String
    },
    open_time: {
        type: String,
        required: [true, 'Please add an opening time']
    },
    close_time: {
        type: String,
        required: [true, 'Please add a closing time']
    },
    image: {
        type: [String],
        required: [true, 'Please add Image']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


RestaurantSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);