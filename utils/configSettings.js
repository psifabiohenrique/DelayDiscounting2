const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');

// Configurações padrão
const DEFAULT_CONFIG = {
    // First instruction
    firstInstruction: "Bem-vindo ao experimento de desconto de atraso",
    buttonCanPressTime: 3,

    // Photo selection
    checkPhotoSelection: true,
    selectPhotosInstruction: "Instrução para selecionar fotos",
    totalPhotosNumber: 20,
    selectPhotosNumber: 10,

    // Photo rating
    ratePhotosInstruction: "Instrução para ranquear as fotos",

    // First questionary
    questionaryInstruction: "Instrução para o questionário",
    checkRepeateQuestionary: true,
    choiceQuestionaryInstruction: "Instrução para completar o questionário com o intervalo {valor}",
    questionHighlight: "O intervalo atual é {valor}",
    minChoice: "Escolha mínima",
    maxChoice: "Escolha máxima",
    photosToQuestionary: [0, 4, 9],
    intervalValues: ["1 dia", "1 semana", "1 mês", "3 meses", "6 meses"],

    // Second questionary
    secondQuestionaryInstruction: "Instrução antes do segundo questionário",
    checkRepeatQuestionary: true,
    choiceSecondQuestionaryInstruction: "Instrução para a escolha do segundo questionário",
    secondQuestionaryHighlight: "Destaque do segundo questionário",
    secondMinChoice: "Escolha mínima do segundo questionário",
    secondMaxChoice: "Escolha máxima do segundo questionário",

    // Thanks message
    thanksMessage: "Obrigado por participar!",
};

class ConfigManager {
    constructor() {
        // Usar o mesmo diretório de dados do usuário que o DataExporter
        const userDataPath = app ? app.getPath('userData') : process.cwd();
        this.configFolder = path.join(userDataPath, 'data');
        this.configFilePath = path.join(this.configFolder, 'config.json');
        this.ensureConfigFolder();
    }

    async ensureConfigFolder() {
        try {
            await fs.access(this.configFolder);
        } catch {
            await fs.mkdir(this.configFolder, { recursive: true });
        }
    }

    async saveConfigFile(config = null) {
        await this.ensureConfigFolder();
        const configToSave = config || DEFAULT_CONFIG;
        const configJson = JSON.stringify(configToSave, null, 2);
        
        await fs.writeFile(this.configFilePath, configJson, 'utf-8');
        console.warn(`Configuração salva em: ${this.configFilePath}`);
        
        return configToSave;
    }

    async loadConfigFile() {
        try {
            await this.ensureConfigFolder();
            await fs.access(this.configFilePath);
            
            const configJson = await fs.readFile(this.configFilePath, 'utf-8');
            if (configJson && configJson.trim()) {
                const parsedConfig = JSON.parse(configJson);
                console.warn(`Configuração carregada de: ${this.configFilePath}`);
                return parsedConfig;
            } else {
                console.warn('Arquivo de configuração vazio, usando configuração padrão');
                return await this.saveConfigFile(DEFAULT_CONFIG);
            }
        } catch (error) {
            console.warn('Arquivo de configuração não encontrado, criando com configuração padrão');
            return await this.saveConfigFile(DEFAULT_CONFIG);
        }
    }

    getConfigFolderPath() {
        return this.configFolder;
    }

    getConfigFilePath() {
        return this.configFilePath;
    }
}

// Criar instância única do gerenciador de configuração
const configManager = new ConfigManager();

// Exportar funções que mantêm compatibilidade com o código existente
async function saveConfigFile(config = null) {
    return await configManager.saveConfigFile(config);
}

async function loadConfigFile() {
    return await configManager.loadConfigFile();
}

module.exports = { 
    saveConfigFile, 
    loadConfigFile, 
    ConfigManager,
    DEFAULT_CONFIG 
};