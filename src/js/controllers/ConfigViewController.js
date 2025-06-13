class ConfigViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.config, gameController);
    }

    async setupView() {
        await this.loadScreen();
        let config = this.gameController.getGameSettings();

        this.getElementById('first-instruction').value = config.firstInstruction;
        this.getElementById('button-can-press-time').value = config.buttonCanPressTime;
        this.getElementById('select-photos-instruction').value = config.selectPhotosInstruction;
        this.getElementById('total-photos-number').value = config.totalPhotosNumber;
        this.getElementById('select-photos-number').value = config.selectPhotosNumber;


        this.getElementById('save-button').addEventListener('click', async () => {
            config = {
                firstInstruction: this.getElementById('first-instruction').value,
                buttonCanPressTime: this.getElementById('button-can-press-time').value,
                selectPhotosInstruction: this.getElementById('select-photos-instruction').value,
                totalPhotosNumber: this.getElementById('total-photos-number').value,
                selectPhotosNumber: this.getElementById('select-photos-number').value,
            }
            await this.gameController.saveGameSettings(config);
            this.gameController.nextScreen(constants.home);
        });
        this.getElementById('reset-button').addEventListener('click', async () => {
            await this.gameController.resetGameSettings();
            this.gameController.nextScreen(constants.config)
        });
        this.getElementById('back-button').addEventListener('click', () => {
            this.gameController.nextScreen(constants.home);
        });
    }
}

window.ConfigViewController = ConfigViewController;