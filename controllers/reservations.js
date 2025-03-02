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
            return res.status(404).json({success: false , message: `no reservation with the id of ${req.params.id}`});
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
        if(req.body.restaurant) req.params.restaurantId = req.body.restaurant;
        else req.body.restaurant = req.params.restaurantId;
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        
        if(!restaurant){
            return res.status(404).json({
                success: false,
                message: `No restaurant with the id of ${req.params.restaurantId}`
            });
        }

        const dateReq = new Date(req.body.reserDate);

        if (isNaN(dateReq)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reservation time"
            });
        }

        if(dateReq < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Can't Make Reservation in Past"
            })
        }

        
        const openTime = new Date(dateReq);
        const closeTime = new Date(dateReq);

        const [openHour, openMinute] = restaurant.open_time.split(":");
        const [closeHour, closeMinute] = restaurant.close_time.split(":");
        
        openTime.setHours(parseInt(openHour), parseInt(openMinute), 0, 0);
        closeTime.setHours(parseInt(closeHour), parseInt(closeMinute), 0, 0);

        console.log(dateReq + '\n' + openTime + '\n' + closeTime + '\n' + (dateReq >= openTime) + '\n' + (dateReq <= closeTime));
        if (openHour < closeHour) {
            if(!(dateReq >= openTime && dateReq <= closeTime))
            return res.status(400).json({
                success: false,
                message: `Reservation time must be between ${restaurant.open_time} and ${restaurant.close_time}`
            });
        }else{
            if(!(dateReq >= openTime || dateReq <= closeTime))
            return res.status(400).json({
                success: false,
                message: `Reservation time must be between ${restaurant.open_time} and ${restaurant.close_time}`
            });
        }

        req.body.user = req.user.id;
        const existedReservations = await Reservation.find({user:req.user.id});
        
        if(existedReservations.length >= 3 && req.user.role !== 'admin'){
            return res.status(403).json({
                success: false ,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }
        
        const reservation = await Reservation.create(req.body);
        res.status(201).json({
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
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
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
                message: `User ${req.user.id} is not authorized to update this reservation`
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

