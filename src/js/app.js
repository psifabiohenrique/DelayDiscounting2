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
            questionaryInstructionShown: false,
            secondQuestionaryInstructionShown: false,
            showQuestionary: true,
            repeatQuestionary: false,
            photosToQuestionary: [],

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
        this.gameState.photosToQuestionary = [...this.gameSettings.photosToQuestionary];
        this.gameState.repeatQuestionary = this.gameSettings.checkRepeateQuestionary;
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
                if (!this.gameState.questionaryInstructionShown && !this.gameState.secondQuestionaryInstructionShown) {
                    this.instructionView.setupView(this.gameSettings.firstInstruction);
                    this.gameState.questionaryInstructionShown = true;
                } else if (this.gameState.questionaryInstructionShown && !this.gameState.secondQuestionaryInstructionShown) {
                    this.instructionView.setupView(this.gameSettings.questionaryInstruction);
                    this.gameState.secondQuestionaryInstructionShown = true;
                } else if (this.gameState.questionaryInstructionShown && this.gameState.secondQuestionaryInstructionShown) {
                    this.instructionView.setupView(this.gameSettings.secondQuestionaryInstruction);
                    this.gameState.questionaryInstructionShown = false;
                    this.gameState.secondQuestionaryInstructionShown = false;
                } else {
                    console.warn("Unhandled instruction state in navigateToScreen method.");
                }
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
                // Case for skiping photo selection
                if (!this.gameSettings.checkPhotoSelection && this.gameState.showQuestionary) {
                    console.log('Case for skiping photo selection')
                    this.questionaryView = new QuestionaryViewController(this);
                    const valuesList = [...this.gameSettings.intervalValues];
                    this.questionaryView.setupView(this.gameState.participantData.photoRanking[0], valuesList);
                    this.gameState.showQuestionary = false;

                    // Case for handling photo selection
                } else if (this.gameState.photosToQuestionary.length > 0 && this.gameSettings.checkPhotoSelection) {
                    console.log('Case for handling photo selection')
                    this.questionaryView = new QuestionaryViewController(this);
                    const valuesList = [...this.gameSettings.intervalValues];
                    this.questionaryView.setupView(this.gameState.participantData.photoRanking[this.gameState.photosToQuestionary[0]], valuesList);
                    this.gameState.photosToQuestionary.shift();

                    // Case for handling repeat questionary
                } else if (this.gameState.repeatQuestionary) {
                    this.gameState.photosToQuestionary = [...this.gameSettings.photosToQuestionary];
                    this.gameState.repeatQuestionary = false;

                    // const valuesList = [...this.gameSettings.intervalValues];
                    // this.questionaryView.setupView(this.gameState.participantData.photoRanking[this.gameState.photosToQuestionary[0]], valuesList);
                    // this.gameState.photosToQuestionary.shift();
                    this.nextScreen(constants.instruction);
                    console.log(this.gameState.photosToQuestionary)
                    console.log(this.gameSettings.photosToQuestionary)
                    console.log("Case for handling repeat questionary")

                    // Case to exit program
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
        console.log(screenName)

        if (screenName === constants.postInstruction) {
            // Select Photos
            if (this.gameState.questionaryInstructionShown && !this.gameState.secondQuestionaryInstructionShown) {
                this.navigateToScreen(constants.selectPhotos, data)

                // First Questionary
            } else if (this.gameState.questionaryInstructionShown && this.gameState.secondQuestionaryInstructionShown) {
                this.navigateToScreen(constants.questionary, data)

                // Second Questionary
            } else if (!this.gameState.questionaryInstructionShown && !this.gameState.secondQuestionaryInstructionShown) {
                this.navigateToScreen(constants.questionary, data)
            }
        } else {
            this.navigateToScreen(screenName || constants.home, data);
        }
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
        try {
            const result = await window.electronAPI.saveData(this.gameState.participantData);
            if (result.success) {
                await window.electronAPI.closeApp();
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