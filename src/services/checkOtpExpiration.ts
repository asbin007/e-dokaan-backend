import { Response } from "express";
import sendResponse from "./sendResponse";

const checkOtpExpiration=(res:Response,otpGeneratedTime:string,thresholdTime:number)=>{
    const currentTime=Date.now()
    if(currentTime-parseInt(otpGeneratedTime)<=thresholdTime)
        // otp expires vako xaina

    sendResponse(res,200,"valid OTp,now you can proced to reset password")
    else{
        // otp expires now
        sendResponse(res,403,"Otp expired, sorry try again")
    }
}
export default checkOtpExpiration