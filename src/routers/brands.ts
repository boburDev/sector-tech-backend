import { Router } from 'express';
import * as Brands from '../controllers/brands';
import { uploadPhoto } from '../middlewares/multer';
const router = Router();

router.get('/by-id/:id', Brands.getBrandById);
router.get('/all', Brands.getAllBrands);
router.post('/create', uploadPhoto.single('logo'), Brands.createBrand);
router.put('/update/:id', uploadPhoto.single('logo'), Brands.updateBrand);
router.delete('/delete/:id', Brands.deleteBrand);




export default router;
