import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from "fs";
import path from "path";

const SAVE_PATH = path.join(__dirname, "..", "..", "public", "shopnag");

if (!fs.existsSync(SAVE_PATH)) {
    fs.mkdirSync(SAVE_PATH, { recursive: true });
}

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

export async function getFullHtml(url: string) {
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

export async function extractProductData(htmlContent: string): Promise<ProductData & { images: { image_url: string, image_local: string }[] }> {
    const $ = cheerio.load(htmlContent);

    const title = $(".Header_titleWrapper__uDN0c").text().trim() || "";
    const priceTag = $("span[itemprop='price']");
    const price = priceTag.attr("content") || "";

    const stockTag = $("div[title='В наличии']").first();
    const stock = stockTag.text().trim().replace("В наличии: ", "").replace(" шт", "") || "";

    const brandTag = $(".Header_titleBrand__FmiI4 img");
    const brand = brandTag.attr("alt") || "Noma’lum";

    const article = $(".ArticleCodeCopy_text__hVxD6").text().trim() || "";

    let code = "";
    const codeTag = $("div:contains('Код товара')").filter((_, el) => $(el).text().trim() === "Код товара");
    if (codeTag.length) {
        code = codeTag.next("div").first().text().trim();
    }

    const description = $(".About_content__TuRAb").text().trim() || "";

    const imageContainer = $(".ImagesCarousel_itemThumbList__fMexZ");
    const images = imageContainer.find("img.Picture_image__qGkYa").toArray();
    const imageUrls: string[] = [];

    for (const img of images) {
        const src = $(img).attr("src");
        
        if (src) {
            const fullUrl = src.startsWith("http") ? src : `https://shop.nag.uz${src}`;
            imageUrls.push(fullUrl);
        }
    }

    const downloadedImages = await downloadImages(imageUrls, title);

    // Xarakteristikalar
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
        characteristics,
        images: downloadedImages
    };
}

export async function downloadImages(imageUrls: string[], title: string): Promise<any> {
    const downloadedFiles: string[] = [];
    const imgTitle = title.replace(/[\\/*?:"<>|]/g, "").replace(/\s+/g, "_");

    for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        try {
            const response = await axios.get(imageUrl, { responseType: "stream" });

            const ext = path.extname(imageUrl.split("?")[0]) || ".webp";
            const filename = `${Date.now() }_${imgTitle}${ext}`;
            const filePath = path.join(SAVE_PATH, filename);

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on("finish", () => resolve());
                writer.on("error", (err) => reject(err));
            });

            downloadedFiles.push(`shopnag/${filename}`);
        } catch (error) {
            console.error(`❌ Rasm yuklab olinmadi: ${imageUrl}`, error);
        }
    }

    return downloadedFiles;
}