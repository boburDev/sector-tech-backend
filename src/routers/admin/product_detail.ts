import { Router } from 'express';
import * as ProductCondition from '../../controllers/product_details';
import { validateAdminToken } from '../../middlewares/adminValidator';
const router = Router();

router
 .get('/condition/all', validateAdminToken, ProductCondition.getAllProductConditions)
 .get('/condition/by-id/:id', validateAdminToken, ProductCondition.getProductConditionById)
 .get('/condition/by-name/:name', validateAdminToken, ProductCondition.getProductConditionByName)
 .post('/condition/create', validateAdminToken, ProductCondition.createProductCondition)
 .put('/condition/update/:id', validateAdminToken, ProductCondition.updateProductCondition)
 .delete('/condition/delete/:id', validateAdminToken, ProductCondition.deleteProductCondition)
 
 .get('/relavance/all', validateAdminToken, ProductCondition.getAllProductRelavances)
 .get('/relavance/:id', validateAdminToken, ProductCondition.getProductRelavanceById)
 .post('/relavance/create', validateAdminToken, ProductCondition.createProductRelavance)
 .get('/relavance/by-name/:name', validateAdminToken, ProductCondition.getProductRelavanceByName)
 .put('/relavance/update/:id', validateAdminToken, ProductCondition.updateProductRelavance)
 .delete('/relavance/delete/:id', validateAdminToken, ProductCondition.deleteProductRelavance);

export default router;
 