


import express,{Router} from 'express'
import categoryController from '../controllers/categoryContoller'
import userMiddleware from '../middleware/userMiddleware'
const router:Router = express.Router()

router.route("/").get(categoryController.getCategories).post(userMiddleware.isUserLoggedIn, categoryController.addCategory)
router.route("/:id").patch(categoryController.updateCategory).delete(categoryController.deleteCategories)

export default router 