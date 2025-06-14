import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DataExporter {
    constructor() {
        this.dataFolder = path.join(__dirname, '..', 'data');
        this.ensureDataFolder();
    }

    async ensureDataFolder() {
        try {
            await fs.access(this.dataFolder);
        } catch {
            await fs.mkdir(this.dataFolder, { recursive: true });
        }
    }

    async exportToCSV(participantData, filename = null) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvFilename = filename || `participant_data_${participantData.participantId || 'unknown'}_${timestamp}.csv`;
        const filePath = path.join(this.dataFolder, csvFilename);

        const csvData = this.formatDataForCSV(participantData);

        await fs.writeFile(filePath, csvData, 'utf-8');
        return filePath;
    }

    formatDataForCSV(data) {
        // Define headers based on the maximum number of responses
        const maxResponses = Math.max(...data.responses.map(r => r.data.length));

        const headers = [
            'participant_id',
            'age',
            'photo_id',
            'photo_name',
            'ranking_position',
            ...data.options.map((option, i) => `response_${option}`)
        ];

        let csvContent = headers.join(',') + '\n';

        // Process each photo's data
        data.responses.forEach((response, index) => {
            const photoId = data.selectedPhotos.find(p => p.alt === response.photo)?.id || '';
            const rankingPosition = data.photoRanking.findIndex(p => p.alt === response.photo) + 1;

            const row = [
                data.participantId,
                data.ageElement,
                photoId,
                response.photo,
                rankingPosition,
                ...this.padArray(response.data, maxResponses)
            ];

            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });

        return csvContent;
    }

    padArray(arr, length) {
        return [...arr, ...Array(length - arr.length).fill('')];
    }
}