import { NextFunction, Request, Response } from "express";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

// interface ProductRequest extends Request {
//   file?: {
//     filename: string;
//   };
// }

class ProductController {
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      productName,
      productDescription,
      productPrice,
      productTotalStock,
      discount,
      categoryId

    } = req.body;
    console.log(req.file)

    //@ts-ignore
    const filename = req.file
      ? req.file.filename
      : "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png";
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productTotalStock ||
      !categoryId
    ) {
      res.status(400).json({
        message:
          "Please provide productName,productDescription,productPrice,productTotalStock,discount,categoryId",
      });
      return;
    }
    await Product.create({
      productName,
      productDescription, 
      productPrice,
      productTotalStock,
      discount: discount || 0,
      categoryId:categoryId,
      productImgUrl: filename,
    });
    res.status(200).json({
      message: "Product created successfully",
    });
  }
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const datas = await Product.findAll({
      include: [
        {
          model: Category,
          attributes:['id','categoryName']
        },
      ],
    });
    res.status(200).json({
      message:"Products fetched successfully",
      data:datas
    })
  }
  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const [datas] = await Product.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: Category,
          attributes : ['id','categoryName']

        },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data: datas,
    });
  }
  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const datas = await Product.findAll({
      where: {
        id: id,
      },
    });
    if (datas.length === 0) {
      res.status(404).json({
        message: "No product with that id",
      });
    } else {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Products deleted successfully",
        data: datas,
      });
    }
  }
}
export default new ProductController();
