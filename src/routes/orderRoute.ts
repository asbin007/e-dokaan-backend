import express, { Router } from "express";

import orderController from "../controllers/orderController";
import userMiddleware, { Role } from "../middleware/userMiddleware";
import errorHandler from "../services/errorHandler";
const router: Router = express.Router();

router
  .route("/")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.createOrder)
  )
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchMyOrder)
  );
router
  .route("/verify-pidx")
  .post(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.verifyTransaction)
  );
router
  .route("/admin/change-status/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(orderController.updateOrderStatus)
  );
router
  .route("/admin/delete-order/:id")
  .post(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Admin),
    errorHandler(orderController.deleteOrder)
  );
router
  .route("/cancel-order/:id")
  .patch(
    userMiddleware.isUserLoggedIn,
    userMiddleware.accessTo(Role.Customer),
    errorHandler(orderController.cancelMyOrder)
  );

router
  .route("/:id")
  .get(
    userMiddleware.isUserLoggedIn,
    errorHandler(orderController.fetchOrderDetails)
  );

export default router;
