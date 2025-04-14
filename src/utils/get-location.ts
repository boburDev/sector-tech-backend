import axios from "axios";
import dotenv from 'dotenv';
import { CustomError } from "../error-handling/error-handling";

dotenv.config();

export const getLocations = async (name: string) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const autocompleteRes = await axios.get(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            {
                params: {
                    input: name,
                    key: apiKey,
                    language: 'uz',
                    types: 'geocode',
                    components: 'country:uz'
                }
            }
        );

        const predictions = autocompleteRes.data.predictions;
        if (!predictions.length) {
            return { message: "❌ Tavsiyalar topilmadi", results: [] };
        }

        const results = await Promise.all(
            predictions.map(async (prediction: any) => {
                const placeId = prediction.place_id;

                const detailsRes = await axios.get(
                    'https://maps.googleapis.com/maps/api/place/details/json',
                    {
                        params: {
                            place_id: placeId,
                            key: apiKey,
                            language: 'uz'
                        }
                    }
                );

                const result = detailsRes.data.result;
                if (!result || !result.geometry) return null;

                const components: any = {};
                result.address_components.forEach((comp: any) => {
                    if (comp.types.includes('street_number')) components.house_number = comp.long_name;
                    if (comp.types.includes('route')) components.street = comp.long_name;
                    if (comp.types.includes('locality')) components.city = comp.long_name;
                    if (comp.types.includes('administrative_area_level_1')) components.region = comp.long_name;
                    if (comp.types.includes('administrative_area_level_2')) components.district = comp.long_name;
                    if (comp.types.includes('country')) components.country = comp.long_name;
                    if (comp.types.includes('postal_code')) components.postal_code = comp.long_name;
                });

                const fullStreet = components.house_number
                    ? `${components.street} ${components.house_number}`
                    : components.street;

                return {
                    description: prediction.description,
                    formatted_address: result.formatted_address,
                    full_street: fullStreet,
                    district: components.district,
                    city: components.city,
                    region: components.region,
                    country: components.country,
                    postal_code: components.postal_code
                };
            })
        );

        return {
            message: '✅ Tavsiyalar topildi',
            results: results.filter(r => r !== null)
        };

    } catch (error) {
        console.error("❌ getLocations xatolik:", error);
        throw new CustomError('❌ Xatolik yuz berdi', 500);
    }
};
