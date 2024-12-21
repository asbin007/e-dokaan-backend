import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../services/genereteToken";
import generateOtp from "../services/generateOpt";
import sendMail from "../services/sendMail";
import sendResponse from "../services/sendResponse";
import findData from "../services/findData";
import checkOtpExpiration from "../services/checkOtpExpiration";

class UserController {
  static async register(req: Request, res: Response) {
    // incomming user data receive
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      res.status(400).json({
        message: "Please provide usernmae,password and email",
      });
      return;
    }

    // data=--> user table mah insert garne
    await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    res.status(201).json({
      message: "User registered succesfully",
    });
  }

  static async login(req: Request, res: Response) {
    // accept incomming data-> email,password
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
    // checking email that exist or not
    // note find-->findALl -- array, findId---> findByPk->object
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "No user with this email",
      });
    } else {
      // if exits then
      const isEqual = bcrypt.compareSync(password, user.password);
      if (!isEqual) {
        res.status(400).json({
          message: "Invalid password",
        });
      } else {
        const token = generateToken(user.id);
        res.status(200).json({
          message: "Logined Successfully",
          token,
        });
      }
    }
  }
  static async handleForgotPassword(req:Request,res:Response){
    const {email} = req.body 
    if(!email){
        res.status(400).json({message : "Please provide email"})
        return
    }
    
    const [user] = await User.findAll({
        where : {
            email : email
        }
    })
    if(!user){
         res.status(404).json({
            email : "Email not registered"
        })
        return
    }
   // otp pathaunu paryo aba, generate otp, mail sent
   const otp = generateOtp()
   await sendMail({
       to : email, 
       subject : "Digital Dokaan Password Change Request", 
       text : `You just request to reset password. Here is your otp, ${otp}`
   })
   user.otp = otp.toString()
   user.otpGeneratedTime = Date.now().toString()
   await user.save()

   res.status(200).json({
       message : "Password Reset OTP sent!!!!"
   })

}
static async verifyOtp(req:Request,res:Response){
    const {otp,email}=req.body;
    if(!otp || !email){
        sendResponse(res,404,"Please provide otp and email ")
        return
    }
    const user=await findData(User,email)
    if(!user){
        sendResponse(res,404,"No user with that email")
    }
    // otp verification

    const [data]=await User.findAll({
        where:{
            otp,email
        }
    })
    if(!data){
        sendResponse(res,404,'Invalid OTP')
        return
    }
    const otpGeneratedTime = data.otpGeneratedTime
        checkOtpExpiration(res,otpGeneratedTime,120000)
}
static async resetPassword(req:Request,res:Response){
    const {newPassword,confirmPassword,email}=req.body;
    if(!newPassword ||!confirmPassword ||!email){
        sendResponse(res,400,'Please Provide newPassword,confirm password,email,otp')
        return
    }
    if(newPassword !== confirmPassword){
        sendResponse(res,400,'newpassword and confirm password must be same')
    }
    const user= await findData(User,email)
    if(!user){
        sendResponse(res,404,'No email with that user')
    }
    user.password=bcrypt.hashSync(newPassword,12)
    await user.save()
    sendResponse(res,200,"Password Reset Successfully !!!")
}

}
export default UserController;
