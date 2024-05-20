import { Schema, Types, model } from 'mongoose';

const cartSchema = new Schema({
    userId : {
        type:Types.ObjectId,
        required: true,
        unique: true,
        ref:'User'
    },
    products : [
        {
            productId : {type:Types.ObjectId , ref :'Product', required: true},
            quantity:{type:Number,default:1}
        }
    ]
},
{
    timestamps:true,
});



const cartModel = model('Cart',cartSchema);
export default cartModel;
