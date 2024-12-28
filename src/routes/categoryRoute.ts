


import express ,{Router} from 'express';
import categoryContoller from '../controllers/categoryContoller';
import userMiddleware, { Role } from '../middleware/userMiddleware';






const router:Router=express.Router()


router.route('/').get(categoryContoller.getCategories).post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),categoryContoller.addCategory)
router.route('/:id').patch(userMiddleware.accessTo(Role.Admin),categoryContoller.updateCategory).delete(userMiddleware.accessTo(Role.Admin),categoryContoller.deleteCategories)
export default router;
