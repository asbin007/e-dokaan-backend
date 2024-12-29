import express, { Router } from "express";
import productController from "../controllers/productController";
import { multer, storage } from "../middleware/multerMiddleware";
import userMiddleware, { Role } from "../middleware/userMiddleware";
const upload = multer({ storage: storage });
const router = express.Router();

// router.route('/').post(productController.createProduct)
router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImage"),
    productController.createProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    productController.deleteProduct
  )
  .get(productController.getAllProducts)
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    productController.deleteProduct
  );

export default router;
