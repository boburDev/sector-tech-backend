import express from 'express'
import * as CatalogFilter from '../../controllers/catalog_filter';
import { validateAdminToken } from '../../middlewares/adminValidator';

const router = express.Router();

router
    .get('/by/:id', validateAdminToken, CatalogFilter.getCatalogFilterById)
    .post('/create', validateAdminToken, CatalogFilter.createCatalogFilter)
    .put('/update/:id', validateAdminToken, CatalogFilter.updateCatalogFilter)
    .delete('/delete/:id', validateAdminToken, CatalogFilter.deleteCatalogFilter);

export default router
