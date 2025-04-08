import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../error-handling/error-handling";
import { extractProductData, getFullHtml } from "../../utils/fetch-data";

export const fetchDataFromShopNag = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { url } = req.body

        if (!url) throw new CustomError('url are required', 400);
        
        const htmlCode = await getFullHtml(url);

        if (!htmlCode) throw new CustomError('Body not exist', 400);

        const productInfo = await extractProductData(htmlCode);
        res.status(201).json({ data: productInfo, error: null, status: 201 });
    } catch (error) {
        next(error);
    }
}
