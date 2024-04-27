import { Router } from "express";
import * as controller from './product.controller.js';

const router = Router();

router.get('/', (req, res) => {
    return res.json({message:"Product"});
})

export default router;