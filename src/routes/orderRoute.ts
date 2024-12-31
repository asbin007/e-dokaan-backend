import express, { Router } from 'express';
import { Role } from './../middleware/userMiddleware';

import orderController from "../controllers/orderController"
import userMiddleware from "../middleware/userMiddleware"
import errorHandler from '../services/errrorHandler';
const router:Router=express.Router()



router.route('/').post(userMiddleware.isUserLoggedIn,errorHandler(orderController.createOrder))


export default router