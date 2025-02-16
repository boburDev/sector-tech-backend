import express from 'express'
import * as Product from '../controllers/products';
import { validateAdminToken } from '../middlewares/adminValidator';
import { uploadPhoto } from '../middlewares/multer';
const router = express.Router();

router
    .get('/', validateAdminToken, Product.getProducts)
    .get('/:id', validateAdminToken, Product.getProductById)
    .post('/create', uploadPhoto.array("productImages", 5), Product.createProduct)
// validateAdminToken,

export default router
