import express,{Router} from 'express'
import productController from '../controllers/productController'
const router =express.Router()


router.route('/').post(productController.createProduct)


export default router