import fs from 'fs';

export const deleteFile = (path: string) => {
    const oldPath = `public/${path}`;
    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
    }
}