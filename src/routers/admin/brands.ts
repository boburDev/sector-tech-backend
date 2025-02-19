import { Router } from 'express';
import * as Brands from '../../controllers/brands';
import { uploadPhoto } from '../../middlewares/multer';
import { validateAdminToken } from '../../middlewares/adminValidator';

const router = Router();

router.get('/by-id/:id', validateAdminToken, Brands.getBrandById);
router.get('/all', validateAdminToken, Brands.getAllBrands);
router.post('/create', validateAdminToken, uploadPhoto.single('logo'), Brands.createBrand);
router.put('/update/:id', validateAdminToken, uploadPhoto.single('logo'), Brands.updateBrand);
router.delete('/delete/:id', validateAdminToken, Brands.deleteBrand);




export default router;
