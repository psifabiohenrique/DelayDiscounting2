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
        this.listOfValues = listOfValues;

        await this.loadScreen();
        this.config = this.gameController.getGameSettings();

        if(this.photo.src) {
            this.getElementById('questionaryPhoto').src = this.photo.src;
        } else {
            this.getElementById('questionaryPhoto').parentElement.style.display = 'none';
        }
        const confirmButton = this.getElementById('confirmChoice');
        confirmButton.addEventListener('click', () => this.handleConfirmChoice());
        this.setupProceedButtonTimer(confirmButton);
        this.setupSliderValueDisplay();
        this.initialize();

    }


    initialize() {
        this.lastValue = this.listOfValues[0];
        const descriptionDiv = this.getElementById('questionaryDescription');
        const questionHighlight = this.getElementById('highlightText');
        questionHighlight.innerHTML = this.config.questionHighlight.replace('{valor}', this.lastValue);
        const instructionText = this.config.choiceQuestionaryInstruction.replace('{valor}', this.lastValue);
        const paragraphs = instructionText.split('\n').filter(p => p.trim() !== '');
        descriptionDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        this.listOfValues.shift();

        const minChoice = this.getElementById('minChoice');
        const maxChoice = this.getElementById('maxChoice');
        minChoice.innerHTML = this.config.minChoice || '';
        maxChoice.innerHTML = this.config.maxChoice || '';

    }
    
    handleConfirmChoice() {
        
        this.choices.push(this.getElementById('choiceProportion').value);
        this.getElementById('choiceProportion').value = 50;
        this.getElementById('currentSliderValue').textContent = '50%'
        
        if(this.listOfValues.length > 0) {
            this.initialize()
        } else {
            this.gameController.setParticipantData(this.photo.alt, this.choices);
            this.gameController.nextScreen(constants.questionary);
        }
        
        const confirmButton = this.getElementById('confirmChoice');
        this.setupProceedButtonTimer(confirmButton);

    }

    setupSliderValueDisplay() {
        const slider = this.getElementById('choiceProportion');
        const valueDisplay = this.getElementById('currentSliderValue');
        
        slider.addEventListener('input', (event) => {
            valueDisplay.textContent = `${event.target.value}%`;
        });
        
        slider.addEventListener('change', (event) => {
            valueDisplay.textContent = `${event.target.value}%`;
        });
    }

}

window.QuestionaryViewController = QuestionaryViewController;