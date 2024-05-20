import { Router } from "express";
import * as controller from './cart.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./cart.role.js";

const router = Router();

router.post('/',auth(endPoints.create),controller.create);
router.patch('/:productId',auth(endPoints.delete),controller.remove);
router.put('/clear',auth(endPoints.delete),controller.clearCart);
router.patch('/updateQuantity/:productId',auth(endPoints.delete),controller.updateQuantity);


export default router;