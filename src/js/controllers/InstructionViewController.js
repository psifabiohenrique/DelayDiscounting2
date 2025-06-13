class InstructionViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.instruction, gameController);
        this.config = null;
    }

    async setupView(questinaryInstructionShown = false) {
        await this.loadScreen();
        this.config = this.gameController.getGameSettings();

        console.log('Game settings loaded:', this.config);

        if (!questinaryInstructionShown) {
            this.firstInstruction();
        } else {
            this.questinaryInstruction();
        }

    }

    firstInstruction() {
        const instructionDiv = this.getElementById('instruction');
        const proceedButton = this.getElementById('proceed-button');

        // Split the instruction text into paragraphs and create <p> elements
        const instructionText = this.config.firstInstruction || '';
        const paragraphs = instructionText.split('\n').filter(paragraph => paragraph.trim() !== '');
        
        // Clear existing content
        instructionDiv.innerHTML = '';
        
        // Create and append <p> elements for each paragraph
        paragraphs.forEach(paragraph => {
            const pElement = document.createElement('p');
            pElement.innerHTML = paragraph.trim();
            instructionDiv.appendChild(pElement);
        });

        // Setup timer for proceed button
        proceedButton.addEventListener('click', () => {
            this.gameController.nextScreen(constants.selectPhotos);
        })
        this.setupProceedButtonTimer(proceedButton);
    }

    questinaryInstruction() {
        const instructionDiv = this.getElementById('instruction');
        const proceedButton = this.getElementById('proceed-button');

        // Split the instruction text into paragraphs and create <p> elements
        const instructionText = this.config.questionaryInstruction || '';
        const paragraphs = instructionText.split('\n').filter(paragraph => paragraph.trim() !== '');
        
        // Clear existing content
        instructionDiv.innerHTML = '';
        
        // Create and append <p> elements for each paragraph
        paragraphs.forEach(paragraph => {
            const pElement = document.createElement('p');
            pElement.innerHTML = paragraph.trim();
            instructionDiv.appendChild(pElement);
        });

        // Setup timer for proceed button
        proceedButton.addEventListener('click', () => {
            this.gameController.nextScreen(constants.questionary);
        })
        this.setupProceedButtonTimer(proceedButton);
    }

}

window.InstructionViewController = InstructionViewController;