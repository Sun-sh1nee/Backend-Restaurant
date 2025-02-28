const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

exports.getReservations = async (req,res,next) => {
    let query;
    
    if(req.user.role !== 'admin'){
        query = Reservation.find({user:req.user.id}).populate({
            path: 'restaurant',
            select: 'name address tel'
        });

    }else{
        if(req.params.restaurantId) {
            console.log(req.params.restaurantId);
            query = Reservation.find({restaurant: req.params.restaurantId}).populate({
                path: "restaurant",
                select: "name address tel"
            });
        }else{
            query = Reservation.find().populate({
                path: 'restaurant',
                select: 'name address tel'
            });
        }

        
    }
    try{
        const reservations = await query;
        console.log(reservations);
        res.status(200).json({
            success:true,
            count: reservations.length,
            data: reservations
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Cannot find Reservation"
        });
    }

}

exports.getReservation = async (req,res,next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name address tel'
        });
        if(!reservation){
            return res.status(404).json({success: false , messsage: `no reservation with theid of ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    }catch (error){
        console.log(error);
        return res.status(500).json({success:false , message:"Cannot find Reservation"});
    }
}


exports.addReservation = async (req,res,next) => {
    try{
        req.body.restaurant = req.params.restaurantId;
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        console.log(req.params.restaurantId );
        if(!restaurant){
            return res.status(404).json({
                success: false,
                message: `No restaurant with the id of ${req.params.restaurantId}`
            });
        }

        const openTime = new Date(`2021-10-12T${restaurant.open_time}:00`);
        const closeTime = new Date(`2021-10-12T${restaurant.close_time}:00`);

        const reservationTime = new Date(`2021-10-12T${req.body.time}:00`);

        if (reservationTime < openTime || reservationTime > closeTime) {
            return res.status(400).json({
                success: false,
                message: `Reservation time must be between ${restaurant.open_time} and ${restaurant.close_time}`
            });
        }

        req.body.user = req.user.id;
        const existedReservations = await Reservation.find({user:req.user.id});

        if(existedReservations.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success: false ,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            success: true,
            data: reservation
        });
    }catch (error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create reservation"
        });
    }
}

exports.updateReservation = async (req,res,next) =>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({
                success: false,
                message: `no Reservation with the id of ${req.params.id}`
            });
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not autherized to update this reservation`
            });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success:true,
            data: reservation
        });

    }catch( error){
        console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Cannot update Reservation"
        });
    }
}


exports.deleteReservation = async (req,res,next) =>{
    try{
        const reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({
                success: false,
                message: `no Reservation with the id of ${req.params.id}`
            });
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not autherized to update this reservation`
            });
        }

        await reservation.deleteOne();
        res.status(200).json({
            success:true,
            data: {}
        });

    }catch( error){
        console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Cannot delete Reservation"
        });
    }
}

