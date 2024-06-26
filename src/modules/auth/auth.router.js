import { Router } from "express";
import * as controller from './auth.controller.js'
const router = Router();

router.post('/register',controller.register);
router.post('/login',controller.login);
router.patch('/sendCode',controller.sendCode);
router.patch('/forgetPassword',controller.forgetPassword);

export default router;