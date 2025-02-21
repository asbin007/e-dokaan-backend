import express, { Router } from 'express';

import orderController from "../controllers/orderController"
import userMiddleware, { Role } from "../middleware/userMiddleware"
import errorHandler from '../services/errorHandler';
const router:Router=express.Router()



router.route('/').post(userMiddleware.isUserLoggedIn,errorHandler(orderController.createOrder)).get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchMyOrder))
router.route('/:id').get(userMiddleware.isUserLoggedIn,errorHandler(orderController.fetchOrderDetails))
router.route('/verify-pidx').post(userMiddleware.isUserLoggedIn,errorHandler(orderController.verifyTransaction))
router.route("/cancel-order/:id").patch(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Customer), errorHandler(orderController.cancelMyOrder))



export default router