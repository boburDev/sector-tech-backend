import fs from 'fs';
import path from 'path';

export const deleteFile = (path: string) => {
    const oldPath = `public/${path}`;
    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
    }
}

export const deleteFileBeforeSave = (filePath: string | null) => {
    if (filePath) {
        const fullPath = path.resolve(filePath);

        fs.unlink(fullPath, (err) => {
            if (err) {
                console.error(`Faylni o‘chirishda xatolik yuz berdi: ${err.message}`);
            } else {
                console.log(`Fayl muvaffaqiyatli o‘chirildi: ${fullPath}`);
            }
        });
    }
}