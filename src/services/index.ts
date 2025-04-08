import { insertBrandData } from "./addBrands";
import { insertCatalogData } from "./addCatalog";
import { insertCountryData } from "./addCountry";

export default async function insertData (query: any) {
    try {
        if (query && query.name) {
            const name = query.name
            if (name == 'catalogs') {
                await insertCatalogData()
            } else if (name == 'brands') {
                await insertBrandData()
            } else if (name == 'countries') {
                await insertCountryData()
            }
        }
    } catch (error) {
        console.log(error);
        
    }
} 