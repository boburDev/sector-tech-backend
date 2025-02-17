import { Router } from 'express';
import * as ProductCondition from '../controllers/product_details';
import { validateAdminToken } from '../middlewares/adminValidator';
const router = Router();

router
 .get('/condition/all', validateAdminToken, ProductCondition.getAllProductConditions)
 .get('/condition/:id', validateAdminToken, ProductCondition.getProductConditionById)
 .post('/condition/create', validateAdminToken, ProductCondition.createProductCondition)
 .get('/condition/by-name/:name', validateAdminToken, ProductCondition.getProductConditionByName)
 .put('/condition/update/:id', validateAdminToken, ProductCondition.updateProductCondition)
 .delete('/condition/delete/:id', validateAdminToken, ProductCondition.deleteProductCondition);

router
 .get('/relevance/all', validateAdminToken, ProductCondition.getAllProductRelevances)
 .get('/relevance/:id', validateAdminToken, ProductCondition.getProductRelevanceById)
 .post('/relevance/create', validateAdminToken, ProductCondition.createProductRelevance)
 .get('/relevance/by-name/:name', validateAdminToken, ProductCondition.getProductRelevanceByName)
 .put('/relevance/update/:id', validateAdminToken, ProductCondition.updateProductRelevance)
 .delete('/relevance/delete/:id', validateAdminToken, ProductCondition.deleteProductRelevance);
 
export default router;
 