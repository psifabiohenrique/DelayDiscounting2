const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

class DataExporter {
    constructor() {
        // No ambiente empacotado, usar o diretório de dados do usuário
        const userDataPath = app ? app.getPath('userData') : process.cwd();
        this.dataFolder = path.join(userDataPath, 'data');
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

        try {
            await fs.writeFile(filePath, csvData, 'utf-8');
            
            // Log do caminho onde foi salvo
            console.warn(`Dados salvos em: ${filePath}`);
            return {success: true, filePath:filePath};
        } catch (error) {
            console.error(`Erro ao salvar os dados: ${error.message}`);
            return {success: false, error: error.message};
        }
    }

    formatDataForCSV(data) {
        // Define headers based on the maximum number of responses
        const maxResponses = Math.max(...data.responses.map(r => r.data.length));

        const headers = [
            'participant_id',
            'age',
            'condition',
            'photo_id',
            'photo_name',
            'ranking_position',
            ...data.options.map((option, i) => `response_${option}`)
        ];

        let csvContent = headers.join(',') + '\n';

        // Process each photo's data
        data.responses.forEach((response, index) => {
            const photoId = data.selectedPhotos.find(p => p.alt === response.photo)?.id || 'Sem foto';
            const rankingPosition = data.photoRanking.findIndex(p => p.alt === response.photo) + 1;

            const row = [
                data.participantId,
                data.ageElement,
                response.condition,
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

    // Método para obter o caminho da pasta de dados
    getDataFolderPath() {
        return this.dataFolder;
    }
}

module.exports = { DataExporter };