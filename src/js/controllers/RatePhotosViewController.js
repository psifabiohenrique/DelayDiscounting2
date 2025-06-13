class RatePhotosViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.ratePhotos, gameController);

        this.photoOrder = [];
        this.currentRanking = [];
    }

    async setupView() {
        await this.loadScreen();
        let config = this.gameController.getGameSettings();
        this.photoOrder = this.gameController.getParticipantData().selectedPhotos;

        this.getElementById('instruction-rate-photos').innerHTML = config.ratePhotosInstruction;

        this.renderPhotos();
        this.setupDragAndDrop();
        this.setupSubmitButton();
    }

    renderPhotos() {
        const container = this.getElementById('photo-rating-container');
        container.innerHTML = '';

        this.currentRanking = [...this.photoOrder];
        console.log(this.currentRanking);

        this.currentRanking.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, index);
            container.appendChild(photoElement);
        });
    }

    createPhotoElement(photo, index) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.draggable = true;
        photoDiv.dataset.photoId = photo.id || index;
        photoDiv.dataset.originalIndex = index;

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt || `Photo ${index}`;
        img.className = 'photo-image';

        const positionIndicator = document.createElement('div');
        positionIndicator.className = 'position-indicator';
        positionIndicator.textContent = index + 1;

        photoDiv.appendChild(img);
        photoDiv.appendChild(positionIndicator);

        return photoDiv;
    }

    setupDragAndDrop() {
        const container = this.getElementById('photo-rating-container');
        let draggedElement = null;
        let draggedIndex = null;

        container.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            draggedIndex = Array.from(container.children).indexOf(draggedElement);
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        container.addEventListener('dragend', (e) => {
            if(e.target.classList.contains('photo-item')) {
                e.target.classList.remove('dragging');
                draggedElement = null;
                draggedIndex = null;
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const afterElement = this.getDragAfterElement(container, e.clientY);
            const dragging = container.querySelector('.dragging');

            if(afterElement == null) {
                container.appendChild(dragging);
            } else {
                container.insertBefore(dragging, afterElement);
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            this.updateRanking();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.photo-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateRanking() {
        const container = this.getElementById('photo-rating-container');
        const photoElements = container.querySelectorAll('.photo-item');

        this.currentRanking = [];
        photoElements.forEach((element, index) => {
            const originalIndex = parseInt(element.dataset.originalIndex);
            this.currentRanking.push(this.photoOrder[originalIndex]);

            const positionIdicator = element.querySelector('.position-indicator');
            positionIdicator.textContent = index + 1;
        });
    }

    setupSubmitButton() {
        const submitButton = document.getElementById('submit-rating');
        submitButton.addEventListener('click', () => this.submitRanking());
    }

    submitRanking() {
        this.gameController.nextScreen(constants.instruction, {photoRanking: this.currentRanking});
    }
}

window.RatePhotosViewController = RatePhotosViewController;