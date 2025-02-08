import express from 'express'
import * as Catalog from '../controllers/catalog';
import { validateAdminToken } from '../middlewares/adminValidator';

const router = express.Router();

// Catalog routes
router.post('/create', validateAdminToken, Catalog.createCatalog);
router.get('/with-subcatalogs', validateAdminToken, Catalog.getAllCatalogs);
router.get('/by/:id', validateAdminToken, Catalog.getCatalogById);
router.put('/update/:id', validateAdminToken, Catalog.updateCatalog);
router.delete('/delete/:id', validateAdminToken, Catalog.deleteCatalog);

// Subcatalog routes
router.get('/subcatalog/with-categories/:id', validateAdminToken, Catalog.getSubcatalogWithCategoryByCatalogId);
router.get('/subcatalog/by-id/:id', validateAdminToken, Catalog.getSubcatalogById);
router.post('/subcatalog/create', validateAdminToken, Catalog.createSubcatalog);
router.put('/subcatalog/update/:id', validateAdminToken, Catalog.updateSubcatalog);
router.delete('/subcatalog/delete/:id', validateAdminToken, Catalog.deleteSubcatalog);



// Category routes 
router.get('/category/by-subcatalog/:id', validateAdminToken, Catalog.getCategoriesBySubcatalogId);
router.post('/category/create', validateAdminToken, Catalog.createCategory);
router.put('/category/update/:id', validateAdminToken, Catalog.updateCategory);
router.delete('/category/delete/:id', validateAdminToken, Catalog.deleteCategory);


export default router


