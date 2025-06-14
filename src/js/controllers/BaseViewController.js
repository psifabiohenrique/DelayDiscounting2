class BaseViewController {
    constructor(screenName, gameController) {
        this.screenName = screenName;
        this.gameController = gameController;

    }

    async loadScreen() {
        const screenLoader = this.gameController.getScreenLoader();
        if (!screenLoader) {
            throw new Error("ScreenLoader não disponível");
        }

        try {
            await screenLoader.loadScreen(this.screenName);
        } catch (error) {
            console.error(`[${this.screenName}ViewController] erro ao carregar a view`, error);
        }
    }

    getElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`[${this.constructor.name}] Elemento '${id}' não encontrado`);
        }
        return element;
    }

    setupProceedButtonTimer(proceedButton) {
        if (!proceedButton) return;

        let timeRemaining = this.config.buttonCanPressTime;
        proceedButton.disabled = true;
        
        // Update button text with remaining time
        const updateButtonText = () => {
            proceedButton.textContent = `Presseguir (${timeRemaining}s)`;
        };

        // Initial button state
        updateButtonText();

        // Start countdown timer
        const timer = setInterval(() => {
            timeRemaining--;
            
            if (timeRemaining > 0) {
                updateButtonText();
            } else {
                // Timer finished - enable button
                clearInterval(timer);
                proceedButton.disabled = false;
                proceedButton.textContent = 'Prosseguir';
            }
        }, 1000);        
    }
}

window.BaseViewController = BaseViewController;