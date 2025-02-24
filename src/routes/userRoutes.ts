import express from 'express';
import UserController from '../controllers/userContoller';
import userMiddleware, { Role } from '../middleware/userMiddleware';

const router=express.Router();


// router.post("/register",UserController.register)
// router.get("/register",UserController.register)

router.route('/register').post(UserController.register)
router.route('/login').post(UserController.login)
router.route('/verify-otp').post(UserController.verifyOtp)
router.route('/forgot-password').post(UserController.handleForgotPassword)
router.route('/reset-password').post(UserController.resetPassword)
router.route('/users').get(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),UserController.fetchUsers)
export default router