import { Router } from "express";
import * as controller from './coupon.controller.js';
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./coupon.role.js";
const router = Router();

router.get('/',auth(endPoints.get),controller.getAll)
router.post('/',auth(endPoints.create),controller.create);

export default router;