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

        // game variable initialization
        this.gameState = {
            currentScreen: null,
            previousScreen: null,
            questinaryInstructionShown: false,
            showQuestionary: true,
            participantData: {
                responses: [],
            }
        }

        this.imagesPath = [];

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
            this.gameState.participantData = { ...this.gameState.participantData, ...data };
        }

        switch (screenName) {
            case constants.home:
                const images = await window.electronAPI.loadImages(this.gameSettings.totalPhotosNumber);
                this.imagesPath = images.images;
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
                if (this.gameSettings.checkPhotoSelection) {
                    this.selectPhotosView.setupView();
                } else {
                    const onePhoto = { id: 1, src: this.imagesPath[0].path, alt: "Foto 1", selected: true };
                    this.gameState.participantData.photoRanking = [onePhoto,]
                    this.gameState.participantData.selectedPhotos = [onePhoto,]
                    this.gameSettings.photosToQuestionary = []
                    this.nextScreen(constants.instruction);
                }
                break;
            case constants.ratePhotos:
                this.ratePhotosView.setupView();
                break;
            case constants.questionary:
                if (!this.gameSettings.checkPhotoSelection && this.gameState.showQuestionary) {
                    this.questionaryView = new QuestionaryViewController(this);
                    const valuesList = [...this.gameSettings.intervalValues];
                    this.questionaryView.setupView(this.gameState.participantData.photoRanking[0], valuesList);
                    this.gameState.showQuestionary = false;
                } else if (this.gameSettings.photosToQuestionary.length > 0 && this.gameSettings.checkPhotoSelection) {
                    this.questionaryView = new QuestionaryViewController(this);
                    const valuesList = [...this.gameSettings.intervalValues];
                    this.questionaryView.setupView(this.gameState.participantData.photoRanking[this.gameSettings.photosToQuestionary[0]], valuesList);
                    this.gameSettings.photosToQuestionary.shift();
                } else {
                    this.nextScreen(constants.thanks);
                }
                break;
            case constants.thanks:
                this.thanksView = new ThanksViewController(this).setupView();
                break;
            default:
                console.error(`Unknown screen: ${screenName}`);
        }
    }

    nextScreen(screenName = null, data = null) {
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

    setParticipantData(photo, data) {
        this.gameState.participantData.responses.push({ photo, data });
        this.gameState.participantData.options = this.gameSettings.intervalValues;
    }

    getParticipantData() {
        return this.gameState.participantData;
    }

    getPhotos() {
        return this.imagesPath;
    }

    async finalizeGame() {
        console.log(this.gameState.participantData);
        try {
            const result = await window.electronAPI.saveData(this.gameState.participantData);
            if(result.success) {
                // await window.electronAPI.closeApp();
            } else {
                alert(result.error)
            }
        } catch (error) {
            console.error(`Error finalizing the game: ${error.message}`);
            throw error;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new GameController();
});

window.GameController = GameController;