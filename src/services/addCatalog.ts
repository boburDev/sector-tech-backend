import AppDataSource from '../config/ormconfig';
import { Catalog, Subcatalog, Category } from '../entities/catalog.entity';
import { createSlug } from '../utils/slug';

// Repository obyektlarini olish
const catalogRepository = AppDataSource.getRepository(Catalog);
const subcatalogRepository = AppDataSource.getRepository(Subcatalog);
const categoryRepository = AppDataSource.getRepository(Category);

export async function insertCatalogData(catalogData: any) {
    await AppDataSource.transaction(async transactionalEntityManager => {
        for (const catalogItem of catalogData) {
            let catalog = await catalogRepository.findOne({ where: { title: catalogItem.name } });

            if (!catalog) {
                catalog = catalogRepository.create({
                    title: catalogItem.name,
                    slug: createSlug(catalogItem.name)
                });
                catalog = await transactionalEntityManager.save(catalog);
            }

            for (const subcatalogItem of catalogItem.subcatalog) {
                let subcatalog = await subcatalogRepository.findOne({
                    where: { title: subcatalogItem.name, catalogId: catalog.id },
                });

                if (!subcatalog) {
                    subcatalog = subcatalogRepository.create({
                        title: subcatalogItem.name,
                        slug: createSlug(subcatalogItem.name),
                        catalogId: catalog.id,
                    });
                    subcatalog = await transactionalEntityManager.save(subcatalog);
                }

                for (const categoryItem of subcatalogItem.category) {
                    let category = await categoryRepository.findOne({
                        where: { title: categoryItem.name, subCatalogId: subcatalog.id },
                    });

                    if (!category) {
                        category = categoryRepository.create({
                            title: categoryItem.name,
                            slug: createSlug(categoryItem.name),
                            subCatalogId: subcatalog.id,
                        });
                        await transactionalEntityManager.save(category);
                    }
                }
            }
        }
    });

    console.log("✅ Katalog ma'lumotlari muvaffaqiyatli qo'shildi!");
}
