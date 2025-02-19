import { Request, Response } from "express";
import Order from "../database/models/orderModel";
import OrderDetails from "../database/models/orderDetails";
import { PaymentMethod, PaymentStatus } from "../globals/types";
import Payment from "../database/models/paymentModel";
import axios from "axios";
import Cart from "../database/models/cartModel";

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
      city,
      zipCode,
      state,
    } = req.body;
    const products: IProduct[] = req.body.products;

    if (
      !phoneNumber ||
      !AddressLine ||
      !totalAmount ||
      products.length === 0 ||
      !firstName ||
      !lastName ||
      !email ||
      !city ||
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
    const orderData = await Order.create({
      phoneNumber,
      AddressLine,
      totalAmount,
      userId,
      firstName,
      lastName,
      email,
      city,
      zipCode,
      state,
    });


    // Create order details
    let data;
    await Promise.all(
    data=  products.map(async (product) => {
        await OrderDetails.create({
          quantity: product.productQty,
          productId: product.productId,
          orderId: orderData.id,
        });
        await Cart.destroy({
          where: {
            userId,
            productId: product.productId,
          },
        })
      })
    );

    // Create payment
    const paymentData = await Payment.create({
      orderId: orderData.id,
      paymentMethod: paymentMethod,
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
        data
      });
    } else if (paymentMethod === PaymentMethod.Esewa) {
      // Esewa payment logic
      // Implement your logic here
      res.status(200).json({
        message: "Order created successfully with Esewa payment method",
      });
    } else {
      res.status(400).json({
        message: "Invalid payment method",
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
}

export default OrderController;
