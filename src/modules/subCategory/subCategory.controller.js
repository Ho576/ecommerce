import { request } from "express";
import categoryModel from "../../../db/models/category.model.js";
import cloudinary from '../../utlis/cloudinary.js';
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";

export const getAll = async(req,res)=>{

    const {id} = req.params;

    const subCategories = await subCategoryModel.find({categoryId:id});
    return res.status(200).json({message : "success", subCategories});
}

export const getActive = async(req,res)=>{
    const {id} = req.params;
    const categorise = await subCategoryModel.find({categoryId:id,status:'Active'}).select("name");
    return res.status(200).json({message : "success", categorise});
}

export const getDetails = async(req,res)=>{

    
    const categorise = await categoryModel.findById(req.params.id);
    return res.status(200).json({message : "success", categorise});
}

export const create = async(req,res)=>{ 

    const {categoryId}= req.body;
    const category = await categoryModel.findById(categoryId);

    if(!category){
        return res.status(404).json({message:'category not found'});
    }

    req.body.name = req.body.name.toLowerCase();
    if (await subCategoryModel.findOne({name:req.body.name })){
        return res.status(409).json({message : "sub category already exists"});
    }
    req.body.slug = slugify(req.body.name);
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder : `${process.env.APPNAME}/subCategories`
    });
    req.body.image = {secure_url,public_id};
    
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    const subCategory = await subCategoryModel.create(req.body);
   return res.json({message :"success" , subCategory });

}

export const update = async(req,res)=>{ 

    const category = await categoryModel.findById(req.params.id);

    if (!category){
        return res.status(404).json({message : "category not found"});
    }
    category.name = req.body.name.toLowerCase();
    if (await categoryModel.findOne({name:req.body.name,_id:{$ne:req.params.id}})){
        return res.status(409).json({message : "name already in use"});
    }
    category.slug = slugify(req.body.name);

    if (req.file){
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
            folder : `${process.env.APPNAME}/subCategories`
        });
        await cloudinary.uploader.destroy(category.image.public_id);        req.body.image = {secure_url,public_id};
    }
   
    category.status = req.body.status?req.body.status:category.status ;

    category.updatedBy = req.user._id;
    await category.save();
   return res.json({message :"success" , category });

}

export const destroy = async(req,res)=>{ 

    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category){
        return res.status(404).json({message : "category not found"});
    }
    await cloudinary.uploader.destroy(category.image.public_id);

    
   return res.status(200).json({message :"success" , category });

}