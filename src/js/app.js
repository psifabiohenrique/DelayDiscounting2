class GameController {
    constructor() {
        this.appDiv = document.getElementById('app');
        this.screenLoader = new ScreenLoader(this.appDiv);

        // setting views
        this.homeView = new HomeViewController(this);
        this.configView = new ConfigViewController(this);
        this.instructionView = new InstructionViewController(this);
        this.selectPhotosView = new SelectPhotosViewController(this);
        this.ratePhotosView = new RatePhotosViewController(this);
        this.questionaryView = new QuestionaryViewController(this);

        // game variable initialization
        this.gameState = {
            currentScreen: null,
            previousScreen: null,
            questinaryInstructionShown: false,
            participantData: {}
        }

        // game settings initialization
        this.gameSettings = {}

        this.initializer();
    }

    async initializer() {
        const settings = await window.electronAPI.loadConfig();
        this.setGameSettings(settings);
        this.nextScreen();
    }

    async navigateToScreen(screenName, data = null) {
        this.gameState.previousScreen = this.gameState.currentScreen;
        this.gameState.currentScreen = screenName;
        if (data) {
            this.gameState.participantData = {...this.gameState.participantData, ...data};
        }

        switch (screenName) {
            case constants.home:
                this.homeView.setupView();
                break;
            case constants.config:
                this.configView.setupView();
                break;
            case constants.instruction:
                this.instructionView.setupView(this.gameState.questinaryInstructionShown);
                this.gameState.questinaryInstructionShown = !this.gameState.questinaryInstructionShown;
                break;
            case constants.selectPhotos:
                this.selectPhotosView.setupView();
                break;
            case constants.ratePhotos:
                this.ratePhotosView.setupView();
                break;
            case constants.questionary:
                // to implement
                this.questionaryView.setupView();
            default:
                console.error(`Unknown screen: ${screenName}`);
        }
    }

    nextScreen(screenName = null, data = null){
        this.navigateToScreen(screenName || constants.home, data);
    }

    getGameSettings() {
        return this.gameSettings;
    }

    setGameSettings(settings) {
        this.gameSettings = settings;
    }

    async saveGameSettings(settings) {
        this.setGameSettings(settings);
        await window.electronAPI.saveConfig(settings);
    }

    async resetGameSettings() {
        await window.electronAPI.resetConfig();
        const settings = await window.electronAPI.loadConfig();

        this.setGameSettings(settings);
    }

    getScreenLoader() {
        return this.screenLoader;
    }

    // setParticipantData(data) {
    //     this.gameState.participantData = {...this.gameState.participantData, ...data};
    // }
    
    getParticipantData() {
        return this.gameState.participantData;
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    const app = new GameController();
});

window.GameController = GameController;