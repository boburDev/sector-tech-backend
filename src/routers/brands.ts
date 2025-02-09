import { Router } from 'express';
import { getBrandById, getAllBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brands';
import { uploadPhoto } from '../middlewares/multer';
const router = Router();

router.get('/by-id/:id', getBrandById);
router.get('/all', getAllBrands);
router.post('/create', uploadPhoto.single('logo'), createBrand);
router.put('/update/:id', uploadPhoto.single('logo'), updateBrand);
router.delete('/delete/:id', deleteBrand);




export default router;
