const Comment = require('../models/Comment');
const Restaurant = require('../models/Restaurant');



exports.getComments = async (req,res,next) => {
    try {
        const Comment = await Comment.findById({restaurant: req.params.id});
        if(!Comment){
            return res.status(404).json({success: false , messsage: `no comment with theid of ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: Comment
        });
    }catch (error){
        // console.log(error);
        return res.status(500).json({success:false , message:"get Comment error"});
    }
}


exports.addComment = async (req,res,next) => {
    try{
       
        if(!req.params.restaurantId) req.params.restaurantId = req.body.restaurant;
        else{
            req.body.restaurant = req.params.restaurantId;
            
        }
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        
        if(!restaurant){
            return res.status(404).json({
                success: false,
                message: `No restaurant with the id of ${req.params.restaurantId}`
            });
        }

        req.body.user = req.user.id;
        const comment = await Comment.create(req.body);
        res.status(200).json({
            success: true,
            data: comment
        });
    }catch (error){
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Commnet"
        });
    }
}

exports.updateComment = async (req,res,next) =>{
    try{
        let comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({
                success: false,
                message: `no Comment with the id of ${req.params.id}`
            });
        }

        if(comment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not autherized to update this comment`
            });
        }

        comment = await Comment.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success:true,
            data: comment
        });

    }catch( error){
        // console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Cannot update Comment"
        });
    }
}


exports.deleteComment = async (req,res,next) =>{
    try{
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({
                success: false,
                message: `no Comment with the id of ${req.params.id}`
            });
        }

        if(comment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not autherized to update this reservation`
            });
        }

        await comment.deleteOne();
        res.status(200).json({
            success:true,
            data: {}
        });

    }catch( error){
        console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Cannot delete Comment"
        });
    }
}

