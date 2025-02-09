import { Router } from 'express';
import { getBrandById, getAllBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brands';

const router = Router();

router.get('/by-id/:id', getBrandById);
router.get('/all', getAllBrands);
router.post('/create', createBrand);
router.put('/update/:id', updateBrand);
router.delete('/delete/:id', deleteBrand);



export default router;
