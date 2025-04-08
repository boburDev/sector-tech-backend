import { CatalogFilter } from '../entities/catalog_filter.entity';
import AppDataSource from '../config/ormconfig';
import { createSlug } from '../utils/slug';

const catalogFilterRepository = AppDataSource.getRepository(CatalogFilter);

(async () => {
    try {
        await AppDataSource.initialize();

        await AppDataSource.transaction(async transactionalEntityManager => {
            let filters = await catalogFilterRepository.find({ withDeleted: true });

            for (const i of filters) {
                const updatedData = i.data
                    .filter((filter: any) => !['состояние-товара', 'актуальность-товара'].includes(filter.name))
                    .map((filter: any) => {
                        const newFilter = { ...filter };
                        
                        // Slugify main filter name
                        newFilter.name = createSlug(newFilter.name);

                        const isBrandOrPrice = filter.name === 'бренд' || filter.name === 'цена';
                        const isRadio = filter.type === 'radio';

                        if (isBrandOrPrice) {
                            delete newFilter.options;
                            delete newFilter.productsId;
                        } else if (isRadio) {
                            delete newFilter.productsId;
                        } else if (Array.isArray(filter.options)) {
                            newFilter.options = newFilter.options.map((option: any) => ({
                                ...option,
                                name: createSlug(option.name),
                                productsId: [...(newFilter.productsId || [])],
                            }));
                            delete newFilter.productsId;
                        }

                        return newFilter;
                    });

                i.data = updatedData;

                await transactionalEntityManager.save(i);
            }
        });

        console.log("✅ Catalog filterlar muvaffaqiyatli yangilandi!");
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating catalog filters:', error);
        process.exit(1);
    }
})();
