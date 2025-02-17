import { Router } from 'express';
import * as ProductDetails from '../controllers/product_details';
import { validateAdminToken } from '../middlewares/adminValidator';
const router = Router();

router
 .get('/all', validateAdminToken, ProductDetails.getAllProductConditions)
 .post('/create', validateAdminToken, ProductDetails.createProductCondition)
 .get('/by-name/:name', validateAdminToken, ProductDetails.getProductConditionByName)
 .put('/update/:id', validateAdminToken, ProductDetails.updateProductCondition)
 .delete('/delete/:id', validateAdminToken, ProductDetails.deleteProductCondition);

export default router;
 