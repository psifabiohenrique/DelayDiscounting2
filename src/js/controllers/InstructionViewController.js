class InstructionViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.instruction, gameController);
        this.config = null;
    }

    async setupView(instructionText) {
        await this.loadScreen();
        this.config = this.gameController.getGameSettings();

        this.showInstruction(instructionText);
        
    }

    showInstruction(instructionText) {
        const instructionDiv = this.getElementById('instruction');
        const proceedButton = this.getElementById('proceed-button');

        // Split the instruction text into paragraphs and create <p> elements
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
            this.gameController.nextScreen(constants.postInstruction);
        })
        this.setupProceedButtonTimer(proceedButton);
    }
}

window.InstructionViewController = InstructionViewController;