import multer, { FileFilterCallback, StorageEngine } from 'multer';
import fs from 'fs';

const photo = ["image/jpeg", "image/png", "image/gif"];

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            let uploadPath = './public'
 
            if (file.fieldname == 'logo') {
                uploadPath += '/brands'
            } else if (file.fieldname === "bannerImages") {
                uploadPath += "/banners"
            }
             else if (file.fieldname == 'categoryImage') {
                uploadPath += '/categories'
            } else if (file.fieldname == 'productImages') {
                uploadPath += '/products'
            } else if (file.fieldname == 'fullDescriptionImages') {
                uploadPath += '/descImages'
            } else {
                throw new Error("Invalid Type or fieldName");
            }

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        } catch (error) {
            console.error("Destination Error:", error);
            cb(error as Error, "");
        }
    },
    filename: (req, file, cb) => {
        try {
            const safeOriginalName = file.originalname.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_.-]/g, "");

            cb(null, `${Date.now()}-${safeOriginalName}`);
        } catch (error) {
            console.error("Filename Error:", error);
            cb(error as Error, "");
        }
    },
});
 
export const uploadPhoto = multer({
    storage: storage,
    limits: {
        files: 5,
        fileSize: 5 * 1024 * 1024
    }, // 30MB limits
    fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
        try {
            const isValidType = photo.includes(file.mimetype);
            const isValidField = ['logo', 'categoryImage', 'productImages', 'fullDescriptionImages', 'bannerImages' ].includes(file.fieldname);

            if (isValidType && isValidField) {
                cb(null, true);
            } else {
                console.error("Invalid File Type or Field Name:", file.mimetype, file.fieldname);
                cb(new Error("Only image files are allowed."));
            }
        } catch (error) {
            console.error("File Filter Error:", error);
            cb(error as Error);
        }
    },
});