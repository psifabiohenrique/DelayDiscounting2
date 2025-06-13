class ScreenLoader {
    constructor(appDiv) {
        this.appDiv = appDiv;
        this.currentScreen = null;
    }

    async loadScreen(screenName, targetElement=null) {
        const target = targetElement || this.appDiv;
        try {
            const response = await fetch(`src/views/${screenName}.html`)
            if (response.ok) {
                const htmlContent = await response.text();
                target.innerHTML = htmlContent;
                this.currentScreen = screenName;
                return;
            }
        }  catch (error) {
            console.warn(`Arquivo src/views/${screenName}.html não foi encontrado`)
        }
    }
}

window.ScreenLoader = ScreenLoader;