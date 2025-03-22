import AppDataSource from '../config/ormconfig';
import { Catalog } from '../entities/catalog.entity';
import { createSlug } from '../utils/slug';

const catalogRepository = AppDataSource.getRepository(Catalog);

;(async () => {
    try {
        await AppDataSource.initialize();
        const catalogs = await catalogRepository.find({ withDeleted: true });

        for (let i = 0; i < catalogs.length; i++) {
            const catalog = catalogs[i];
            const numberPrefix = String(i + 1).padStart(4, '0');
            catalog.slug = `${numberPrefix}.${createSlug(catalog.title)}`;
            await catalogRepository.save(catalog);
            console.log(`✅ Catalog updated: ${catalog.title} → ${catalog.slug}`);
        }

        console.log('🎉 All catalog slugs updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating catalog slugs:', error);
        process.exit(1);
    }
})()