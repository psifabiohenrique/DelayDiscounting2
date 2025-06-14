const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    loadConfig: () => ipcRenderer.invoke('load-config'),
    saveConfig: (config) => ipcRenderer.invoke('save-config', config),
    resetConfig: () => ipcRenderer.invoke('reset-config'),
    saveData: (data) => ipcRenderer.invoke('save-data', data),
    closeApp: () => ipcRenderer.invoke('close-application'),
    openDataFolder: () => ipcRenderer.invoke('open-data-folder'),
    getDataFolderPath: () => ipcRenderer.invoke('get-data-folder-path'),
    loadImages: (numberOfImages) => ipcRenderer.invoke('load-images', numberOfImages)
});