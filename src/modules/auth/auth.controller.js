import userModel from "../../../db/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { customAlphabet } from "nanoid";
import SendEmail from "../../utlis/email.js";

export const register = async (req,res)=>{
    const {userName,email,password}=req.body;

    const user = await userModel.findOne({email});

    if (user){
        return res.status(409).json({message:"email already in use"})
    }
    const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));

    const createUser = await userModel.create({userName,email,password:hashedPassword});

    await SendEmail(email,`welcom`,`<h2>Hello ya ${userName}</h2>`)
    return res.status(201).json({message:"success",user:createUser});
}

export const login = async (req,res)=>{
    const {email,password}=req.body;

    const user = await userModel.findOne({email});

    if (!user){
        return res.status(400).json({message:"invalid data"})
    }
    const match = await bcrypt.compare(password,user.password);
    if (user.status=='NotActive'){
        return res.status(400).json({message:"your account is blocked"})
    }
    if (!match){
        return res.status(400).json({message:"invalid data"})
    }
    const token = jwt.sign({id:user._id,role:user.role},process.env.LOGINSIG);

    return res.status(200).json({message:"success",token});
}

export const sendCode = async (req,res)=>{
    const {email}=req.body;

    const code =customAlphabet('123456789abcdef',4)();

    const user = await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});

    if (!user){
        return res.status(404).json({message:"user not found"})
    }

    await SendEmail(email,`reset password`,`<h2>code is : ${code}</h2>`)
    return res.status(200).json(user)

}

export const forgetPassword = async (req,res)=>{
    const {email,password,code}=req.body;

    const user = await userModel.findOne({email});

    if (!user){
        return res.status(404).json({message:"user not found"})
    }
    if(user.sendCode != code){
        return res.status(400).json({message:"invaled code"})
    }

    user.password = await bcrypt.hash(password,parseInt(process.env.SALTROUND));

    user.sendCode =null;

    await user.save();
    return res.status(200).json({message:"success"});

}
