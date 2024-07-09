
import slugify from 'slugify';
import categoryModel from './../../../db/models/category.model.js';
import subCategoryModel from './../../../db/models/subCategory.model.js';
import cloudinary from './../../utlis/cloudinary.js';
import productModel from '../../../db/models/product.model.js';
import { pagination } from '../../utlis/pagination.js';


export const create = async (req, res) => {
    const {name,price,discount,categoryId,subCategoryId}=req.body;

    const checkCategory =await categoryModel.findById(categoryId);
    if(!checkCategory){
        return res.status(404).json({message:"Category not found"});
    }

    const checkSubCategory =await subCategoryModel.findOne({_id:subCategoryId,categoryId:categoryId});
    if(!checkSubCategory){
        return res.status(404).json({message:"Sub Category not found"});
    }

    req.body.slug = slugify(name);
    req.body.finalPrice = price - ((price * (discount || 0))/100);

    const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,
        {folder : `${process.env.APPNAME}/product/name`}
    );

    req.body.mainImage = {secure_url,public_id};
    req.body.subImages = [];

    for (const file of req.body.subImages){
        const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,
            {folder : `${process.env.APPNAME}/product/subImages`}
        );
        req.body.subImages.push({secure_url,public_id});
    }
    const product = await productModel.create(req.body);
    return res.status(201).json({message:"success",product});
}

export const getProducts = async(req, res) =>{
    const {skip,limit} = pagination(req.query.page, req.query.limit);
    let queryObj = {...req.query};
    const execQuery = ['page','limit','sort'];
    execQuery.map((ele)=>{
        delete queryObj[ele];
    })
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt|gte|lt|lte|in|nin}eq/g,match => `$${match}`);
    queryObj = JSON.parse(queryObj);
    const mongoseQuery = productModel.find({}).skip(skip).limit(limit);
    // .populate({
    //     path:'reviews',
    //     populate:{
    //         path:'userId',
    //         select:'userName -_id'
    //     }
    // }).select('name');

    if(req.query.serch){
        mongoseQuery.find({
            $or:[
                {name:{$regex:req.query.search}},
                {description:{$regex:req.query.search}}
            ]
        });
    }

    const count = await productModel.estimatedDocumentCount();

    const products = await mongoseQuery.sort(req.query.sort).select('name price discount');

    return res.status(200).json({message:"success",products});
}