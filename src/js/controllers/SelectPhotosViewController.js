class SelectPhotosViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.selectPhotos, gameController);
        this.totalPhotosNumber = null;
        this.totalPhotosNumberToSelect = null;
        this.selectedPhotosNumber = 0;

        this.selectedPhotos = new Set();
        this.photos = [];
    }

    async setupView() {
        await this.loadScreen();
        let config = this.gameController.getGameSettings();
        this.totalPhotosNumber = config.totalPhotosNumber;
        this.totalPhotosNumberToSelect = config.selectPhotosNumber;

        this.getElementById('select-photos-instruction').innerText = config.selectPhotosInstruction;
        this.updateSelectedCounter();

        await this.generatePhotos();
        this.renderPhotosGrid();

        this.setupConfirmButton();
        this.setupResetButton();
    }

    async generatePhotos() {
        this.photos = [];
        for (let i = 1; i <= this.totalPhotosNumber; i++) {
            this.photos.push({
                id: i,
                // Usando placeholder images - substitua pelos caminhos reais das suas fotos
                src: `https://picsum.photos/200/150?random=${i}`,
                alt: `Foto ${i}`,
                selected: false
            });
        }
    }

    renderPhotosGrid() {
        const gridContainer = this.getElementById('select-photos-view');
        gridContainer.innerHTML = '';


        const grid = document.createElement('div');
        grid.className = 'photos-grid';

        this.photos.forEach(photo => {
            const photoElement = this.createPhotoElement(photo);
            grid.appendChild(photoElement);
        });

        gridContainer.appendChild(grid);
    }

    createPhotoElement(photo) {
        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-container';
        photoContainer.dataset.photoId = photo.id;

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.className = 'photo-image';

        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';

        const checkIcon = document.createElement('div');
        checkIcon.className = 'check-icon';
        checkIcon.innerHTML = '✓';

        overlay.appendChild(checkIcon);
        photoContainer.appendChild(img);
        photoContainer.appendChild(overlay);

        photoContainer.addEventListener('click', () => {
            this.togglePhotoSelection(photo.id);
        });

        return photoContainer;
    }

    togglePhotoSelection(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        const photoElement = document.querySelector(`[data-photo-id="${photoId}"]`);

        if(this.selectedPhotos.has(photoId)) {
            this.selectedPhotos.delete(photoId);
            photo.selected = false;
            photoElement.classList.remove('selected');
            this.selectedPhotosNumber--;
        } else {
            if(this.selectedPhotosNumber >= this.totalPhotosNumberToSelect) {
                alert(`Você só pode selecionar ${this.totalPhotosNumberToSelect} fotos.`);
                return
            }

            this.selectedPhotos.add(photoId);
            photo.selected = true;
            photoElement.classList.add('selected');
            this.selectedPhotosNumber++;
        }

        this.updateSelectedCounter();
        this.updateConfirmButton();
    }

    updateSelectedCounter() {
        this.getElementById('selected-photos-number').innerText = `${this.selectedPhotosNumber}/${this.totalPhotosNumberToSelect}`;
    }

    setupConfirmButton() {
        const confirmButton = this.getElementById('select-photos-button');
        confirmButton.addEventListener('click', () => {
            this.confirmSelection();
        });
        this.updateConfirmButton();
    }

    setupResetButton() {
        const resetButton = this.getElementById('reset-selection-button');
        resetButton.addEventListener('click', () => {
            this.resetSelection();
        });
    }

    updateConfirmButton() {
        const confirmButton = this.getElementById('select-photos-button');
        const isSelectionComplete = this.selectedPhotosNumber === this.totalPhotosNumberToSelect;

        confirmButton.disabled = !isSelectionComplete;
        confirmButton.innerText = isSelectionComplete ? 'Confirm Selection' : `Selecione ${this.totalPhotosNumberToSelect - this.selectedPhotosNumber} foto(s)`;;
    }

    confirSelection() {
        if (this.selectedPhotosNumber !== this.totalPhotosNumberToSelect) {
            alert(`Por favor, selecione exatamente ${this.totalPhotosNumberToSelect} fotos.`)
            return;
        }

        const selectedPhotosData = this.photos.filter(photo => photo.selected);

        this.gameController.setSelectedPhotos(selectedPhotosData);
        console.log('Fotos selecionadas: ', selectedPhotosData);

        // Navegar para próxima tela quando necessário
        // this.gameController.(nextScreen('Próxima tela'));
    }

    resetSelection() {
        this.selectedPhotos.clear();
        this.selectedPhotosNumber = 0;
        this.photos.forEach(photo => photo.selected = false);

        document.querySelectorAll('.photo-container.selected').forEach(element => {
            element.classList.remove('selected');
        });
        
        this.updateSelectedCounter();
        this.updateConfirmButton();
    }
}

window.SelectPhotosViewController = SelectPhotosViewController;