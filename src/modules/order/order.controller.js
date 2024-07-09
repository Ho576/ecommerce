import couponModel from "../../../db/models/coupon.model.js"
import cartModel from './../../../db/models/cart.model.js';



export const create = async(req,res)=>{
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        return res.status(400).json({message:"cart is empty"});
    }
    if(req.body.couponId){

        const coupon = await couponModel.findById(req.body.couponId);
        if(!coupon){
            return res.status(400).json({message:"coupon not found"});
        } 
        if(coupon.expireDate < new Date()){
            return res.status(400).json({message:"coupon expired"});
        } 
        if(coupon.usedBy.includes(req.user._id)){
            return res.status(409).json({message:"coupon not found"});
        } 

        req.body.coupon = coupon;
    }

    

    return res.status(201).json({message:"success",cart});
}