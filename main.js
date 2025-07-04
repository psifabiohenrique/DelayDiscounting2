const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { loadConfigFile, saveConfigFile } = require('./utils/configSettings');
const { DataExporter } = require('./utils/dataExporter');
const { loadImages } = require('./utils/imageUploader')


function createWindow() {
    const mainWindow = new BrowserWindow({
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: "Experimento de Desconto de Atraso",
        show: false,
        fullscreenable: true,
        fullscreen: true,
        autoHideMenuBar: true,
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadFile('index.html');

    return mainWindow;
}

// IPC Handlers

ipcMain.handle('load-config', async () => {
    try {
        const config = await loadConfigFile();
        return config;
    } catch (error) {
        console.warn("Falha ao carregar objeto de configuração");
        const config = await saveConfigFile()
        return { success: false, error: error.message, data: config };
    }
});

ipcMain.handle('save-config', async (event, config) => {
    try {
        await saveConfigFile(config);
        return { success: true };
    } catch (error) {
        console.warn("Falha ao salvar o arquivo de configuração");
        return { success: false, error: error.message };
    }
});

ipcMain.handle('reset-config', async () => {
    try {
        const config = await saveConfigFile();
        return config;
    } catch (error) {
        console.warn("Falha ao redefinir o arquivo de configuração");
        return {success: false, error: error.message}
    }
});

ipcMain.handle('save-data', async (event, data) => {
    try {
        const exporter = new DataExporter();

        const detailedPath = await exporter.exportToCSV(data);

        return { success: true, path: detailedPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('close-application', async () => {
    try {
        app.quit();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('open-data-folder', async () => {
    try {
        const exporter = new DataExporter();
        const dataFolderPath = exporter.getDataFolderPath();
        await shell.openPath(dataFolderPath);
        return { success: true, path: dataFolderPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('load-images', async (event, numberOfImages) => {
    try {
        const images = await loadImages(numberOfImages);
        return {success: true, images: images};
    } catch (error) {
        return {success: false, error: error.message};
    }
});




app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});