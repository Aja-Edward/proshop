import express from 'express'
import { getProductById, getProducts } from '../controllers/productController.js'
const router = express.Router()




router.route('/').get(getProducts)

router.route('/:id').get(getProductById)


// res.status(404)
// throw new Error("Edward always be careful here. There is error in your code.")
export default router