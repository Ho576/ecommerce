
import slugify from 'slugify';
import categoryModel from './../../../db/models/category.model.js';
import subCategoryModel from './../../../db/models/subCategory.model.js';
import cloudinary from './../../utlis/cloudinary.js';
import productModel from '../../../db/models/product.model.js';


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