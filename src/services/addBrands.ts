import AppDataSource from '../config/ormconfig';
import { Brand } from '../entities/brands.entity';
import { createSlug } from '../utils/slug';
import brandsData from "../services/mock/brands.json";

const brandRepository = AppDataSource.getRepository(Brand);

export async function insertBrandData() {
    try {
        await AppDataSource.transaction(async transactionalEntityManager => {
            for (const brandItem of brandsData) {
                let brand = await brandRepository.findOne({ where: { title: brandItem.title } });

                if (!brand) {
                    brand = brandRepository.create({
                        title: brandItem.title,
                        slug: createSlug(brandItem.title),
                        path: brandItem.path ?? undefined
                    });

                    await transactionalEntityManager.save(brand);
                }
            }
        });

        console.log("✅ Brand ma'lumotlari muvaffaqiyatli qo'shildi!");
    } catch (error) {
        console.log(error);
    }
    
}
