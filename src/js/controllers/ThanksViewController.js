class ThanksViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.thanks, gameController);
    }
    async setupView() {
        const config = this.gameController.getGameSettings()
        await this.loadScreen();
        this.getElementById('thanks-message').innerHTML = config.thanksMessage;
        this.getElementById('finish-button').addEventListener('click', () => this.gameController.finalizeGame());
    }
}


window.ThanksViewController = ThanksViewController;