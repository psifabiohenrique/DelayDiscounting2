class HomeViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.home, gameController);
    }

    async setupView() {
        await this.loadScreen();
        this.getElementById('participant-id').value = this.generateParticipantId();
        const ageElement = this.getElementById('participant-age');
        this.getElementById('start-button').addEventListener('click', () => {
            this.gameController.nextScreen(constants.instruction);
        });        
        this.getElementById('settings-button').addEventListener('click', () => {
            this.gameController.nextScreen(constants.config);
        });
    }

    generateParticipantId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

window.HomeViewController = HomeViewController;