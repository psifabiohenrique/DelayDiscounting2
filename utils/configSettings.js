import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurações padrão
const DEFAULT_CONFIG = {
    firstInstruction: "Bem-vindo ao experimento de desconto de atraso",
    buttonCanPressTime: 3,
    selectPhotosInstruction: "Instrução para selecionar fotos",
    totalPhotosNumber: 20,
    selectPhotosNumber: 10,
};

// Caminho para o arquivo de configurações
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_FILE_PATH = path.join(__dirname, '..', 'config.json');



export async function saveConfigFile(config = null) {
    const configJson = JSON.stringify(config || DEFAULT_CONFIG, null, 2);
    await fs.writeFile(CONFIG_FILE_PATH, configJson, 'utf-8');
    return configJson;
}

export async function loadConfigFile() {
    await fs.access(CONFIG_FILE_PATH);
    const configJson = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
    if (configJson) {
        return JSON.parse(configJson);
    } else {
        return DEFAULT_CONFIG;
    }
}