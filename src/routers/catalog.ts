import express from 'express'
import * as Catalog from '../controllers/catalog';
import { validateAdminToken } from '../middlewares/adminValidator';
import { uploadPhoto } from '../middlewares/multer';

const router = express.Router();

// Catalog routes
/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Catalog management APIs
 */

/**
 * @swagger
 * /catalog/create:
 *   post:
 *     summary: Create a new catalog
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catalog created successfully
 */
router.post('/create', validateAdminToken, Catalog.createCatalog);

/**
 * @swagger
 * /catalog/with-subcatalogs:
 *   get:
 *     summary: Get all catalogs with subcatalogs
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of catalogs
 */
router.get('/with-subcatalogs', validateAdminToken, Catalog.getAllCatalogs);

/**
 * @swagger
 * /catalog/by/{id}:
 *   get:
 *     summary: Get a catalog by ID
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Catalog details
 *       404:
 *         description: Catalog not found
 */
router.get('/by/:id', validateAdminToken, Catalog.getCatalogById);

/**
 * @swagger
 * /catalog/update/{id}:
 *   put:
 *     summary: Update a catalog
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catalog updated successfully
 *       404:
 *         description: Catalog not found
 */
router.put('/update/:id', validateAdminToken, Catalog.updateCatalog);

/**
 * @swagger
 * /catalog/delete/{id}:
 *   delete:
 *     summary: Delete a catalog
 *     tags: [Catalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Catalog deleted successfully
 *       404:
 *         description: Catalog not found
 */
router.delete('/delete/:id', validateAdminToken, Catalog.deleteCatalog);


// Subcatalog routes
/**
 * @swagger
 * tags:
 *   name: Subcatalog
 *   description: Subcatalog management APIs
 */

/**
 * @swagger
 * /catalog/subcatalog/with-categories/{id}:
 *   get:
 *     summary: Get subcatalog with categories by catalog ID
 *     tags: [Subcatalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Subcatalog with categories retrieved successfully
 */
router.get('/subcatalog/with-categories/:id', validateAdminToken, Catalog.getSubcatalogWithCategoryByCatalogId);


/**
 * @swagger
 * /catalog/subcatalog/by-id/{id}:
 *   get:
 *     summary: Get subcatalog by ID
 *     tags: [Subcatalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     responses:
 *       200:
 *         description: Subcatalog retrieved successfully
 *       404:
 *         description: Subcatalog not found
 */
router.get('/subcatalog/by-id/:id', validateAdminToken, Catalog.getSubcatalogById);


/**
 * @swagger
 * /catalog/subcatalog/create:
 *   post:
 *     summary: Create a new subcatalog
 *     tags: [Subcatalog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               catalogId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcatalog created successfully
 */
router.post('/subcatalog/create', validateAdminToken, Catalog.createSubcatalog);


/**
 * @swagger
 * /catalog/subcatalog/update/{id}:
 *   put:
 *     summary: Update a subcatalog
 *     tags: [Subcatalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               catalogId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcatalog updated successfully
 *       404:
 *         description: Subcatalog not found
 */
router.put('/subcatalog/update/:id', validateAdminToken, Catalog.updateSubcatalog);

/**
 * @swagger
 * /catalog/subcatalog/delete/{id}:
 *   delete:
 *     summary: Delete a subcatalog
 *     tags: [Subcatalog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     responses:
 *       200:
 *         description: Subcatalog deleted successfully
 *       404:
 *         description: Subcatalog not found
 */
router.delete('/subcatalog/delete/:id', validateAdminToken, Catalog.deleteSubcatalog);

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management APIs
 */

// Category routes 

/**
 * @swagger
 * /catalog/category/by-subcatalog/{id}:
 *   get:
 *     summary: Get categories by subcatalog ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subcatalog ID
 *     responses:
 *       200:
 *         description: List of categories
 *       404:
 *         description: Categories not found
 */
router.get('/category/by-subcatalog/:id', validateAdminToken, Catalog.getCategoriesBySubcatalogId);


/**
 * @swagger
 * /catalog/category/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subCatalogId:
 *                 type: string
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post('/category/create', validateAdminToken, uploadPhoto.single('categoryImage'), Catalog.createCategory);


/**
 * @swagger
 * /catalog/category/update/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subCatalogId:
 *                 type: string
 *               categoryImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/category/update/:id', validateAdminToken, uploadPhoto.single('categoryImage'), Catalog.updateCategory);


/**
 * @swagger
 * /catalog/category/delete/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/category/delete/:id', validateAdminToken, Catalog.deleteCategory);

export default router
