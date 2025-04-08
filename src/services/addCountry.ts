import AppDataSource from '../config/ormconfig';
import { Country, Region } from '../entities/location.entity';
import countryData from "../services/mock/country.json";

const countryRepository = AppDataSource.getRepository(Country);
const regionRepository = AppDataSource.getRepository(Region);

export async function insertCountryData() {
    try {
        await AppDataSource.transaction(async transactionalEntityManager => {
            for (const countryItem of countryData) {
                let country = await countryRepository.findOne({ where: { name: countryItem.name } });

                if (!country) {
                    country = countryRepository.create({
                        name: countryItem.name
                    });

                    country = await transactionalEntityManager.save(country);
                }

                for (const regionItem of countryItem.regions) {
                    let region = await regionRepository.findOne({ where: { name: regionItem.name, country: { id: country.id } } });

                    if (!region) {
                        region = regionRepository.create({
                            name: regionItem.name,
                            country: country
                        });

                        await transactionalEntityManager.save(region);
                    }
                }
            }
        });

        console.log("✅ Country va Region ma'lumotlari muvaffaqiyatli qo'shildi!");
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error);
        process.exit(1);
    }
}
