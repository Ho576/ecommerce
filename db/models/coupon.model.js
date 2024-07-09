import { Schema, Types, model } from 'mongoose';

const couponSchema = new Schema({
    Name: {
        type: String,
        unique: true,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    usedBy:[{
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }],
    expireDate:{
        type:Date,
        required: true,
    }
},
    {
        timestamps: true,

    });


const couponModel = model('Coupon', couponSchema);
export default couponModel;
