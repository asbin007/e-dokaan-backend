
import { jwt } from 'jsonwebtoken';
import { NextFunction, Request,Response } from "express";
import { envConfig } from '../config/config';
class userMiddleware{

async isUserLoggedIn(req:Request,res:Response,next:NextFunction):Promise<void>{

    // recieve
 const token=   req.header.authorization

 if(!token){
    res.status(400).json({
        message:"Token must be provided"
    })
    return
 }


    // validate token
    jwt.verify(token,envConfig.jwtSecreteKey as string,async (err,result)=>{
        if(err){
            res.status(403).json({
                message:"Invalid Token"
            })
        }
        else{
            console.log(result)
            req.userId=result.userId
            next()
        }
    })
export default new userMiddleware




    
}

}
