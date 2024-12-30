import express, { Router } from "express";
import productController from "../controllers/productController";
import { multer, storage } from "../middleware/multerMiddleware";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errrorHandler";
const upload = multer({ storage: storage });
const router = express.Router();

// router.route('/').post(productController.createProduct)
router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    upload.single("productImage"),
    errorHandler(productController.createProduct)
  )
  .get(productController.getAllProducts);

router
  .route("/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  )
  .get(errorHandler(productController.getSingleProduct))
  .delete(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  );

export default router;
