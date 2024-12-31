import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod } from "../globals/types";
import Payment from "../database/models/paymentModel";
interface IProucts{
    productId: string, productQty: number 
}
interface OrderRequest extends Request{
    user?:{
        id:string
    }
}


class OrderController {
  async createOrder(req: OrderRequest, res: Response):Promise<void> {
    const userId=req.user?.id
    const {
      phoneNumber,
      shipphingAddress,
      totalAmount,
      paymentMethod
      
    } = req.body;
    // products => kati product order garo, kati quantity
    const products:IProucts[]=req.body

    if (
      !phoneNumber ||
      !shipphingAddress ||
      !totalAmount ||
      products.length == 0
    ) {
        res.status(400).json({
            message:"please provide phone number , siphing address, total amount ,products"
        })
        return
    }
    // for order
   const orderData= await Order.create(({
        phoneNumber,
        shipphingAddress,
        totalAmount,
        userId:userId
    }))
// for order detills
    products.forEach(async function(product){
      await  OrderDetails.create({
            quantity: product.productQty,
            productI:product.productId,
            orderId:orderData.id
        })
    })


    // payment method

    if(paymentMethod==PaymentMethod.COD){
        await Payment.create({
            orderId:orderData.id,
            paymentMethod:paymentMethod
        })


    }
    else if(paymentMethod=PaymentMethod.Khalti){

    }
    else{

    }
    res.status(200).json({
        message:"Prder created successfully"
    })
  }
  

}

export default new OrderController;
