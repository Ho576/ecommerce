import { Router } from "express";
import * as controller from './category.controller.js'
import fileUpload, { fileTypes } from "../../utlis/multer.js";
import { auth } from './../../middleware/auth.js';
import subCategoryRouter from './../subCategory/subCategory.router.js';
import { endPoints } from "./category.role.js";

const router = Router();

router.use('/:id/subCategories',subCategoryRouter)
router.post('/',auth(endPoints.create),fileUpload(fileTypes.image).single('image'),controller.create)
router.get('/',auth(endPoints.get),controller.getAll);
router.get('/active',auth(endPoints.active),controller.getActive);
router.get('/:id',controller.getDetails);
router.patch('/:id',auth(),fileUpload(fileTypes.image).single('image'),controller.update);
router.delete('/:id',auth(),controller.destroy);

export default router;