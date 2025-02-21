import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

interface IProduct {
  productId: string;
  productQty: string;
}

interface OrderRequest extends Request {
  user?: {
    id: string;
  };
}

class OrderController {
  static async createOrder(req: OrderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      AddressLine,
      totalAmount,
      paymentMethod,
      firstName,
      lastName,
      email,
      City,
      zipCode,
      state,
    } = req.body;
    const products: IProduct[] = req.body.products;
    console.log(req.body);

    if (
      !phoneNumber ||
      !AddressLine ||
      !totalAmount ||
      products.length === 0 ||
      !firstName ||
      !lastName ||
      !email ||
      !City ||
      !zipCode ||
      !state
    ) {
      res.status(400).json({
        message:
          "Please provide firstName, lastName ,phoneNumber, AddressLine, totalAmount, zipCode and state information for your application",
      });
      return;
    }

    // Create order
    let data;
    // Create payment
    const paymentData = await Payment.create({
      
      paymentMethod: paymentMethod
    });
    const orderData = await Order.create({
      phoneNumber,
      AddressLine,
      totalAmount,
      userId,
      firstName,
      lastName,
      email,
      City,
      zipCode,
      state,
      paymentId: paymentData.id,
    });

   
    // for orderDetails
    products.forEach(async function (product) {
      data = await OrderDetails.create({
        quantity: product.productQty,
        productId: product.productId,
        orderId: orderData.id,
      });

      await Cart.destroy({
        where: {
          productId: product.productId,
          userId: userId,
        },
      });
    });

    


    if (paymentMethod === PaymentMethod.Khalti) {
      // Khalti payment logic
      const data = {
        return_url: "http://localhost:5173/",
        website_url: "http://localhost:5173/",
        amount: totalAmount * 100,
        purchase_order_id: orderData.id,
        purchase_order_name: "Order" + orderData.id,
      };

      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "Key 5d818e0244bd414f99ad73e584d04e11",
          },
        }
      );
      // console.log(response)

      const khaltiResponse = response.data;
      console.log(khaltiResponse);

      paymentData.pidx = khaltiResponse.pidx;
      await paymentData.save(); // Ensure to await the save operation

      res.status(200).json({
        message: "Order created successfully",
        url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,

        data,
      });
    } else if (paymentMethod === PaymentMethod.Esewa) {
      // Esewa payment logic
      // Implement your logic here
      res.status(200).json({
        message: "Order created successfully with Esewa payment method",
      });
    } else {
      res.status(200).json({
        message: "successfully created  order with cash on delivery",
        data,
      });
    }
  }

  static async verifyTransaction(
    req: OrderRequest,
    res: Response
  ): Promise<void> {
    const { pidx } = req.body;

    if (!pidx) {
      res.status(400).json({
        message: "Please provide pidx",
      });
      return;
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      }, // Correctly pass params
      {
        headers: {
          Authorization: "Key 5d818e0244bd414f99ad73e584d04e11",
        },
      }
    );
    console.log(response);

    const data = response.data;
    if (data.status === "Completed") {
      await Payment.update(
        { paymentStatus: PaymentStatus.Paid },
        { where: { pidx: pidx } }
      );
      res.status(200).json({
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        message: "Payment not completed",
      });
    }
  }

  static async fetchMyOrder(req: OrderRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: {
        userId,
      },
      attributes:['id','totalAmount','orderStatus']
      ,
      include:{
        model: Payment,
        attributes:['paymentMethod','paymentStatus']
      }
    });
    if (orders.length > 0) {
      res.status(200).json({
        message: "successfully fetched orders",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No orders found",
        data: [],
      });
    }
  }

  static async fetchOrderDetails(
    req: OrderRequest,
    res: Response
  ): Promise<void> {
    const orderId = req.params.id;
    const userId = req.user?.id 

    const orders = await OrderDetails.findAll({
      where : {
        orderId, 

      }, 
      include : [{
        model : Order , 
        include : [
          {
            model : Payment, 
            attributes : ["paymentMethod","paymentStatus"]
          }
        ],
        attributes : ["orderStatus","AddressLine","City","state","totalAmount","phoneNumber","firstName","lastName"]
      },{
        model : Product, 
        include : [{
          model : Category
        }], 
        attributes : ["productImgUrl","productName","productPrice"]
      }]
    })

    if (orders.length > 0) {
      res.status(200).json({
        message: "Successfully fetched order details",
        data: orders,
      });
    } else {
      res.status(404).json({
        message: "No order details found",
        data: [],
      });
    }
  }
  static async cancelMyOrder(req:OrderRequest,res:Response):Promise<void>{
    const userId = req.user?.id 
    const orderId = req.params.id 
    const [order] = await Order.findAll({
      where : {
        userId : userId, 
        id : orderId 
      }
    })
    if(!order){
      res.status(400).json({
        message : "No order with that Id"
      })
      return 
    }
    // check order status 
    if(order.orderStatus === OrderStatus.Ontheway || order.orderStatus === OrderStatus.Preparation){
      res.status(403).json({
        message : "You cannot cancelled order, it is on the way or preparation mode"
      })
      return
    }
    await Order.update({orderStatus : OrderStatus.Cancelled},{
      where : {
        id : orderId
      }
    })
    res.status(200).json({
      message : "Order cancelled successfully"
    })
  }
}

export default OrderController;
