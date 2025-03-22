import AppDataSource from '../config/ormconfig';
import { Subcatalog } from '../entities/catalog.entity';
import { createSlug } from '../utils/slug';

const subcatalogRepository = AppDataSource.getRepository(Subcatalog);

;(async () => {
    try {
        await AppDataSource.initialize();
        const subcatalogs = await subcatalogRepository.find({ withDeleted: true });

        for (let i = 0; i < subcatalogs.length; i++) {
            const subcatalog = subcatalogs[i];
            const numberPrefix = String(i + 100).padStart(4, '0');
            subcatalog.slug = `${numberPrefix}.${createSlug(subcatalog.title)}`;
            await subcatalogRepository.save(subcatalog);
            console.log(`✅ Subcatalog updated: ${subcatalog.title} → ${subcatalog.slug}`);
        }

        console.log('🎉 All subcatalog slugs updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating subcatalog slugs:', error);
        process.exit(1);
    }
})()