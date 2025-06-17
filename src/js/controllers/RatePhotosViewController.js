class RatePhotosViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.ratePhotos, gameController);
        this.photoOrder = [];
        this.currentRanking = [];
        this.isUpdating = false;
        this.config = null;
    }

    async setupView() {
        await this.loadScreen();
        this.config = this.gameController.getGameSettings();
        this.photoOrder = this.gameController.getParticipantData().selectedPhotos;

        this.getElementById('instruction-rate-photos').innerHTML = this.config.ratePhotosInstruction;

        this.renderPhotos();
        this.setupSubmitButton();
    }

    renderPhotos() {
        const container = this.getElementById('photo-rating-container');
        container.innerHTML = '';

        this.currentRanking = [...this.photoOrder];

        this.currentRanking.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, index);
            container.appendChild(photoElement);
        });
    }

    createPhotoElement(photo, index) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.dataset.photoId = photo.id || index;
        photoDiv.dataset.originalIndex = index;

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || `Photo ${index}`;
        img.className = 'photo-image';

        const positionIndicator = document.createElement('div');
        positionIndicator.className = 'position-indicator';
        const positionInput = document.createElement('input');
        positionInput.className = 'position-input';
        positionInput.type = 'number';
        positionInput.value = index + 1;
        positionInput.setAttribute('min', '1');
        positionInput.setAttribute('max', this.photoOrder.length);

        positionInput.addEventListener('change', (e) => this.handlePositionChange(e, index));
        positionInput.addEventListener('input', (e) => this.validateInput(e.target));

        positionIndicator.appendChild(positionInput);
        photoDiv.appendChild(img);
        photoDiv.appendChild(positionIndicator);
        return photoDiv;
    }

    handlePositionChange(event, photoIndex) {
        if (this.isUpdating) return;

        const input = event.target;
        const newPosition = parseInt(input.value);

        if (!this.validateInput(input)) {
            input.value = this.getCurrentPositionOfPhoto(photoIndex) + 1;
            return;
        }

        this.updateRanking(photoIndex, newPosition - 1);
    }

    validateInput(input) {
        const value = parseInt(input.value);
        const isValid = !isNaN(value) && value >= 1 && value <= this.photoOrder.length;

        input.classList.toggle('invalid', !isValid);
        return isValid;
    }

    getCurrentPositionOfPhoto(originalIndex) {
        return this.currentRanking.findIndex(photo =>
            photo === this.photoOrder[originalIndex]);
    }

    updateRanking(photoIndex, newPosition) {
        this.isUpdating = true;

        const photo = this.photoOrder[photoIndex];
        const currentPosition = this.getCurrentPositionOfPhoto(photoIndex);

        this.currentRanking.splice(currentPosition, 1);
        this.currentRanking.splice(newPosition, 0, photo);

        this.updateAllInputs();
        this.isUpdating = false;
    }

    updateAllInputs() {
        const container = this.getElementById('photo-rating-container');
        const photoElements = container.querySelectorAll('.photo-item');

        photoElements.forEach(element => {
            const originalIndex = parseInt(element.dataset.originalIndex);
            const currentPosition = this.getCurrentPositionOfPhoto(originalIndex);
            const input = element.querySelector('.position-input');
            input.value = currentPosition + 1;
        });
    }

    setupSubmitButton() {
        const submitButton = document.getElementById('submit-rating');
        this.setupProceedButtonTimer(submitButton);
        submitButton.addEventListener('click', () => this.submitRanking());
    }

    submitRanking() {
        const allInputsValid = Array.from(document.querySelectorAll('.position-input'))
            .every(input => this.validateInput(input));

        if (!allInputsValid) {
            alert('Please correct the invalid rankings before proceeding.');
            return;
        }
        
        console.log(this.currentRanking);
        this.gameController.nextScreen(constants.instruction, {photoRanking: this.currentRanking});
    }
}

window.RatePhotosViewController = RatePhotosViewController;