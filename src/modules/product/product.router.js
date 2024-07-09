import { Router } from "express";
import * as controller from './product.controller.js';
import { endPoints } from "./product.role.js";
import fileUpload, { fileTypes } from "../../utlis/multer.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post('/',auth(endPoints.create),fileUpload(fileTypes.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5},
]),controller.create)
router.get('/',controller.getProducts);

export default router;