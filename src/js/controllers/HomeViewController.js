class HomeViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.home, gameController);
    }

    async setupView() {
        await this.loadScreen();
        const participantId = this.generateParticipantId();
        this.getElementById('participant-id').value = participantId;
        this.getElementById('start-button').addEventListener('click', () => {
            const ageElement = this.getElementById('participant-age').value;
            this.gameController.nextScreen(constants.instruction, {participantId, ageElement});
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