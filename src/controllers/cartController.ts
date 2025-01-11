import { Response, Request } from "express";

import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

class CartController {
  async addToCart(req: AuthRequest, res: Response) { // Change Request to AuthRequest
    const userId = req.user?.id; // Now TypeScript recognizes req.user
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      res.status(400).json({ message: "Please provide productId and quantity" });
      return;
    }

    // Check if product exists in the user's cart
    let userKoCartAlreadyxa = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (userKoCartAlreadyxa) {
      // Increment quantity
      userKoCartAlreadyxa.quantity += quantity;
      await userKoCartAlreadyxa.save();
    } else {
      // Insert new cart item
      await Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    res.status(201).json({ message: "Product added to cart" });
  }

  async getCart(req: AuthRequest, res: Response) { // Change Request to AuthRequest
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
          attributes: ["id", "productName", "productPrice", "productImageUrl"],
        },
      ],
    });

    if (cartItems.length === 0) {
      res.status(200).json({ message: "Cart is empty" });
    } else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItems,
      });
    }
  }

  async deleteCartItem(req: AuthRequest, res: Response) { // Change Request to AuthRequest
    const userId = req.user?.id;
    const { productId } = req.params;

    // Check if product exists in the cart
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });

    res.status(200).json({ message: "Product removed from cart" });
  }

  async updateCartItem(req: AuthRequest, res: Response) { // Change Request to AuthRequest
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Check if quantity is provided
    if (!quantity) {
      res.status(400).json({ message: "Please provide quantity" });
      return;
    }

    const cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (!cartItem) {
      res.status(404).json({ message: "Product not found in cart" });
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.status(200).json({ message: "Cart item updated successfully" });
    }
  }
}

export default new CartController();  