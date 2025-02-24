import { Request, Response } from 'express';
import Category from "../database/models/categoryModel";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics", // Fixed typo
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Foods",
    },
  ];

  async seedCategory(): Promise<void> {
    
    const datas = await Category.findAll();
    if (datas.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already seeded");
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    // @ts-ignore
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "Please provide categoryName"
      });
      return;
    }
   const category= await Category.create({
      categoryName,
    });
    res.status(200).json({
      message: "Category created successfully",
      data:category
    });
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Fetched categories",
      data
    });
  }

  async deleteCategories(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "Please provide id to delete"
      });
      return;
    }
    const data = await Category.findOne({
      where: {
        id: id
      }
    });
    if (!data) {
      res.status(404).json({
        message: "No category with that id"
      });
      return; // Added return statement
    } else {
      await Category.destroy({
        where: {
          id
        }
      });
      res.status(200).json({
        message: "Category deleted successfully" // Fixed typo
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body; // Fixed typo
    if (!id || !categoryName) {
      res.status(400).json({
        message: "Please provide id and categoryName to update" // Fixed typo
      });
      return;
    }
    const data = await Category.findOne({
      where: {
        id: id
      }
    });
    if (!data) {
      res.status(404).json({
        message: "No category with that id" // Fixed status code
      });
       // Added return statement
    } else {
      await Category.update({
        categoryName: categoryName // Fixed typo
      }, {
        where: {
          id
        }
      });
      res.status(200).json({
        message: "Category updated successfully"
      });
    }
  }
}

export default new CategoryController; // Fixed typo