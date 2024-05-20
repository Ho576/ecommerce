import { Schema, Types, model } from 'mongoose';

const productSchema = new Schema({
    name : {
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    slug:{
        type:String,
        required: true,
    },
    description: {
        type:String,
    },
    stock:{
        type:Number,
        default:1
    },
    price:{
        type:Number,
        required: true,
    },
    discount : {
        type:Number,
        default:0
    },
    finalPrice:{
        type:Number,
       
    },
    mainImage:{
        type:Object,
        required: true,
    },
    subImages:[{
        type:Object,
        required: true,
    }],
    status:{
        type:String,
        default:'Active',
        enum:['Active','NotActive'],
    },
    sizes:[
        {
            type:String,
            enum:['s','m','lg','xl']
        }
    ],
    colers:[String],
    categoryId : {
        type:Types.ObjectId,
        ref:'Category',
        required:true,
    },
    subCategoryId : {
        type:Types.ObjectId,
        ref:'SubCategory',
        required:true,
    },
   createdBy:{type:Types.ObjectId,ref:'User'},
   updatedBy:{type:Types.ObjectId,ref:'User'},
},
{
    timestamps:true,
});



const productModel = model('Product',productSchema);
export default productModel;
