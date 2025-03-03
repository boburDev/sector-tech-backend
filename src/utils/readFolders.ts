import * as fs from 'fs';
import * as path from 'path';

const publicFolder = path.join(process.cwd(), 'public');

export default async function listContents(subPath: string = '') {
    try {
        const folderPath = path.join(publicFolder, subPath);

        if (!fs.existsSync(folderPath)) {
            throw new Error(`Folder does not exist: ${folderPath}`);
        }

        const items = await fs.promises.readdir(folderPath);
        const result = [];

        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const stats = await fs.promises.stat(itemPath);

            result.push({
                name: item,
                type: stats.isDirectory() ? 'folder' : 'file',
            });
        }

        console.log(result);
        return result;
    } catch (error) {
        console.error('Error reading folder contents:', error);
    }
}
