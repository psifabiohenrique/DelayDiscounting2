class QuestionaryViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.questionary, gameController);
        this.config = null;
        this.lastValue = null;
        this.listOfValues = null;
        this.choices = [];
        this.photo = null;
    }

    async setupView(photo, listOfValues) {

        this.photo = photo;
        await this.loadScreen();
        this.config = this.gameController.getGameSettings();
        this.listOfValues = listOfValues;
        this.getElementById('questionaryPhoto').src = this.photo.src;
        const confirmButton = this.getElementById('confirmChoice');
        confirmButton.addEventListener('click', () => this.handleConfirmChoice());
        this.setupProceedButtonTimer(confirmButton);

        this.initialize();

    }


    initialize() {
        this.lastValue = this.listOfValues[0];
        const descriptionDiv = this.getElementById('questionaryDescription');
        const instructionText = this.config.choiceQuestionaryInstruction.replace('{valor}', this.lastValue);
        const paragraphs = instructionText.split('\n').filter(p => p.trim() !== '');
        descriptionDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        console.log("lastValue: ", this.lastValue)
        console.log("listOfValues: ", this.listOfValues);
        this.listOfValues.shift();
    }

    handleConfirmChoice() {

        this.choices.push(this.getElementById('choiceProportion').value);
        this.getElementById('choiceProportion').value = 50;
        if(this.listOfValues.length > 0) {
            this.initialize()
        } else {
            this.gameController.setParticipantData(this.photo.alt, this.choices);
            this.gameController.nextScreen(constants.questionary);
        }

        const confirmButton = this.getElementById('confirmChoice');
        this.setupProceedButtonTimer(confirmButton);
    }

}

window.QuestionaryViewController = QuestionaryViewController;