


import express ,{Router} from 'express';
import categoryContoller from '../controllers/categoryContoller';
import userMiddleware, { Role } from '../middleware/userMiddleware';






const router:Router=express.Router()


router.route('/').get(categoryContoller.getCategories).post(userMiddleware.isUserLoggedIn,userMiddleware.restrictTo(Role.Admin),categoryContoller.addCategory)
router.route('/:id').patch(categoryContoller.updateCategory).delete(categoryContoller.deleteCategories)
export default router;
