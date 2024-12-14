import { Request,Response } from "express";
import User from "../models/userModel";
import sequelize from "../database/connection";
import bcrypt from 'bcrypt'
import generateToken from "../services/genereteToken";

class UserController{
    static async register(req:Request,res:Response){
        // incomming user data receive
        const {username,password,email}=req.body;
        if(!username || !password||!email){
            res.status(400).json({
                message:"Please provide usernmae,password and email"
            })
        }return;

        // data=--> user table mah insert garne
        await User.create({
            username,
            email,
            password: bcrypt.hashSync(password,10)
        })
        res.status(201).json({
            message:"User registered succesfully"
        })
    }

    static async login(req:Request,res:Response){

        // accept incomming data-> email,password
        const {email,password}=req.body;
        if(!email ||! password){
            res.status(400).json({
                message: "Please provide email and password"
            })
            return
        }
        // checking email that exist or not
// note find-->findALl -- array, findId---> findByPk->object 
        const [user]= await User.findAll({
            where:{
                email:email
            }
        })


        if(!user){
            res.status(400).json({
                message: "No user with this email"
            })
        }
        else{
            // if exits then 
            const isEqual=bcrypt.compareSync(password,user.password);
            if(!isEqual){
                res.status(400).json({
                    message:"Invalid password"
                })
            }else{
              const token=  generateToken(user.id)
                res.status(200).json({
                    message:"Logined Successfully",
                    token
                })
            }
        }
    }
}
export default UserController
