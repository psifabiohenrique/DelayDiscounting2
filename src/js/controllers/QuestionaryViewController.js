class QuestionaryViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.questionary, gameController);
    }

    async setupView() {
        await this.loadScreen();
        let config = this.gameController.getGameSettings();
    }
}

window.QuestionaryViewController = QuestionaryViewController;