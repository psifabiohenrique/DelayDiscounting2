const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

class ImageUploader {
    constructor() {
        const userDataPath = app ? app.getPath('userData') : process.cwd();
        this.dataFolder = path.join(userDataPath, 'data/images');
        this.ensureDataFolder();
    }

    async ensureDataFolder() {
        try {
            await fs.access(this.dataFolder);
        } catch {
            await fs.mkdir(this.dataFolder, { recursive: true });
        }
    }

    async uploadImage(numberOfImages) {
        try {
            const files = await fs.readdir(this.dataFolder);
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

            const imageFiles = files.filter(file => {
                const ext = path.extname(file).toLowerCase();
                return imageExtensions.includes(ext);
            });

            const selectedImages = imageFiles.slice(0, numberOfImages);

            return selectedImages.map(filename => ({
                filename,
                path: path.join(this.dataFolder, filename)
            }));
        } catch (error) {
            console.error('Erro ao ler imagens da pasta:', error);
            return [];
        }
    }
}


const imageUploader = new ImageUploader();

async function loadImages(numberOfImages) {
    return await imageUploader.uploadImage(numberOfImages);
}

module.exports = { loadImages };