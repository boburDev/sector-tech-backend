import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const photo = ["image/jpeg", "image/png", "image/gif"];

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            let uploadPath = './public'

            if (file.fieldname == 'logo') {
                uploadPath += '/brands'
            } else {
                throw new Error("Invalid Type or fieldName");
            }

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        } catch (error) {
            console.log(error);
        }
    },
    filename: (req, file, cb) => {
        try {
            cb(null, Date.now() + path.extname(file.originalname));
        } catch (error) {
            console.log(error);
        }
    },
});

export const uploadPhoto = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limits
    fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
        try {
            const isValidType = photo.includes(file.mimetype);
            const isValidField = ['logo'].includes(file.fieldname);

            if (isValidType && isValidField) {
                cb(null, true);
            } else {
                cb(new Error("Only image files are allowed."));
            }
        } catch (error) {
            console.error(error);
        }
    },
});