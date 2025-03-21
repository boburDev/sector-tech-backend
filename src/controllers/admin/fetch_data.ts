import { NextFunction, Request, Response } from "express";
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CustomError } from "../../error-handling/error-handling";

interface ProductCharacteristic {
    title: string;
    option: {
        title: string;
        value: string;
    }[];
}

interface ProductData {
    title: string;
    brand: string;
    price: string;
    stock: string;
    description: string;
    code: string;
    article: string;
    characteristics: ProductCharacteristic[];
}

async function getFullHtml(url: string) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
            }
        });

        return response.data;
    } catch (error: unknown) {
        console.error(`❌ Xatolik yuz berdi! ${error}`);
        return null;
    }
}

export function extractProductData(htmlContent: string): ProductData {
    const $ = cheerio.load(htmlContent);

    // **Mahsulot nomi**
    const title = $(".Header_titleWrapper__uDN0c").text().trim() || "";

    // **Narxni olish**
    const priceTag = $("span[itemprop='price']");
    const price = priceTag.attr("content") || "";

    // **Ombordagi mavjud miqdorni olish**
    const stockTag = $("div[title='В наличии']").first();
    const stock = stockTag.text().trim().replace("В наличии: ", "").replace(" шт", "") || "";

    // **Brand Logo nomini olish**
    const brandTag = $(".Header_titleBrand__FmiI4 img");
    const brand = brandTag.attr("alt") || "Noma’lum";

    // **Mahsulot artikuli**
    const article = $(".ArticleCodeCopy_text__hVxD6").text().trim() || "";

    // **Mahsulot kodi**
    let code = "";
    const codeTag = $("div:contains('Код товара')").filter((_, el) => $(el).text().trim() === "Код товара");
    if (codeTag.length) {
        code = codeTag.next("div").first().text().trim();
    }

    // **Tavsif (Описание)**
    const description = $(".About_content__TuRAb").text().trim() || "";

    // **Xarakteristikalarni olish**
    const characteristics: ProductCharacteristic[] = [];
    $(".ItemTabProperties_table__sSoeQ").each((_, table) => {
        let currentCategory: ProductCharacteristic | null = null;

        $(table).find("tr").each((_, row) => {
            const th = $(row).find("th.ItemTabProperties_tableHeader__ihqL0");

            if (th.length) {
                if (currentCategory) {
                    characteristics.push(currentCategory);
                }

                currentCategory = {
                    title: th.text().trim(),
                    option: []
                };
                return;
            }

            const cells = $(row).find("td");
            if (cells.length === 2 && currentCategory) {
                const key = $(cells[0]).text().trim();
                const value = $(cells[1]).html()?.replace(/<br\s*\/?>/g, "\n").trim() || "";

                currentCategory.option.push({ title: key, value });
            }
        });

        if (currentCategory && !characteristics.includes(currentCategory)) {
            characteristics.push(currentCategory);
        }
    });

    return {
        title,
        brand,
        price,
        stock,
        description,
        code,
        article,
        characteristics
    };
}


export const fetchDataFromShopNag = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { url } = req.body

        if (!url) throw new CustomError('url are required', 400);
        
        const htmlCode = await getFullHtml(url);

        if (!htmlCode) throw new CustomError('Body not exist', 400);

        const productInfo = extractProductData(htmlCode);
        res.status(201).json({ data: productInfo, error: null, status: 201 });
    } catch (error) {
        next(error);
    }
}
