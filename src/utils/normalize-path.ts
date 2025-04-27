const normalizePaths = (files: Express.Multer.File[]) =>
    files.map(file => file.path.replace(/\\/g, "/").replace(/^public\//, ""));

export default normalizePaths;
