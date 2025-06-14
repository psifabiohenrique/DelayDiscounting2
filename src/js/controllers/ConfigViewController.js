class ConfigViewController extends BaseViewController {
    constructor(gameController) {
        super(constants.config, gameController);
        this.dynamicLists = []; 
    }

    async setupView() {
        await this.loadScreen();
        let config = this.gameController.getGameSettings();

        this.getElementById('first-instruction').value = config.firstInstruction;
        this.getElementById('button-can-press-time').value = config.buttonCanPressTime;
        this.getElementById('select-photos-instruction').value = config.selectPhotosInstruction;
        this.getElementById('total-photos-number').value = config.totalPhotosNumber;
        this.getElementById('select-photos-number').value = config.selectPhotosNumber;
        this.getElementById('rate-photos-instruction').value = config.ratePhotosInstruction;
        this.getElementById('questionary-instruction').value = config.questionaryInstruction;
        this.getElementById('min-choice-text').value = config.minChoice;
        this.getElementById('max-choice-text').value = config.maxChoice;
        this.getElementById('choice-questionary-instruction').value = config.choiceQuestionaryInstruction;
        this.getElementById('thanks-message').value = config.thanksMessage;

        this.setupDynamicLists(config);

        this.setupEventListeners();
    }

    setupDynamicLists(config) {
        this.dynamicLists.photosToQuestionary = new DynamicNumberList({
            containerId: 'photos-to-questionary-container',
            addButtonId: 'add-photo-index',
            initialValues: config.photosToQuestionary || [],
            placeholder: 'Indice da foto começando por 0 (ex: 0, 1, 2... 10...)',
            inputType: 'number',
            min: 0,
            validation: (values, config) => this.validatePhotoIndices(values, config)
        });

        this.dynamicLists.intervalValues = new DynamicNumberList({
            containerId: 'interval-values-container',
            addButtonId: 'add-interval-value',
            initialValues: config.intervalValues || [],
            placeholder: 'Valor do intervalo (ex: 1, 2, 3, 4...)',
            inputType: 'number',
            min: 0,
            validation: (values) => this.validateIntervalValues(values)
        });
    }

    validatePhotoIndices(values, config) {
        if(values.length === 0) {
            return { valid: false, message: 'Adicione pelo menos um índice de foto para o questionário.' };
        }

        const selectPhotosNumber = parseInt(this.getElementById('select-photos-number').value) || 0;
        const maxPhotoIndex = selectPhotosNumber - 1;
        const invalidIndices = values.filter(index => index > maxPhotoIndex);

        if(invalidIndices.length > 0) {
            return { 
                valid: false, 
                message: `Índices inválidos: ${invalidIndices.join(', ')}. O índice máximo é ${maxPhotoIndex} (baseado em ${selectPhotosNumber} fotos selecionadas).` 
            };
        }
        return { valid: true };
    }

    validateIntervalValues(values) {
        if (values.length === 0) {
            return { valid: false, message: 'Adicione pelo menos um valor de intervalo.' };
        }
        return { valid: true };
    }

    setupEventListeners() {
        this.getElementById('save-button').addEventListener('click', async () => {
            const config = {
                firstInstruction: this.getElementById('first-instruction').value,
                buttonCanPressTime: parseInt(this.getElementById('button-can-press-time').value),
                selectPhotosInstruction: this.getElementById('select-photos-instruction').value,
                totalPhotosNumber: parseInt(this.getElementById('total-photos-number').value),
                selectPhotosNumber: parseInt(this.getElementById('select-photos-number').value),
                ratePhotosInstruction: this.getElementById('rate-photos-instruction').value,
                questionaryInstruction: this.getElementById('questionary-instruction').value,
                minChoice: this.getElementById('min-choice-text').value,
                maxChoice: this.getElementById('max-choice-text').value,
                choiceQuestionaryInstruction: this.getElementById('choice-questionary-instruction').value,
                photosToQuestionary: this.dynamicLists.photosToQuestionary.getValues(),
                intervalValues: this.dynamicLists.intervalValues.getValues(),
                thanksMessage: this.getElementById('thanks-message').value,
            };

            // Validar todas as listas dinâmicas
            for (const [key, list] of Object.entries(this.dynamicLists)) {
                const validation = list.validate(config);
                if (!validation.valid) {
                    alert(validation.message);
                    return;
                }
            }

            await this.gameController.saveGameSettings(config);
            this.gameController.nextScreen(constants.home);
        });

        this.getElementById('reset-button').addEventListener('click', async () => {
            await this.gameController.resetGameSettings();
            this.gameController.nextScreen(constants.config);
        });

        this.getElementById('back-button').addEventListener('click', () => {
            this.gameController.nextScreen(constants.home);
        });
    }
}


class DynamicNumberList {
    constructor(options) {
        this.containerId = options.containerId;
        this.addButtonId = options.addButtonId;
        this.initialValues = options.initialValues || [];
        this.placeholder = options.placeholder || 'Digite um valor';
        this.inputType = options.inputType || 'number';
        this.min = options.min !== undefined ? options.min : null;
        this.max = options.max !== undefined ? options.max : null;
        this.validation = options.validation || (() => ({ valid: true }));
        
        this.counter = 0;
        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        container.innerHTML = ''; // Limpar container
        this.counter = 0;

        // Se não há valores, adicionar um campo vazio
        if (this.initialValues.length === 0) {
            this.addField();
        } else {
            // Adicionar campos para cada valor inicial
            this.initialValues.forEach(value => {
                this.addField(value);
            });
        }

        // Configurar botão de adicionar
        const addButton = document.getElementById(this.addButtonId);
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.addField();
            });
        }
    }

    addField(value = '') {
        const container = document.getElementById(this.containerId);
        const fieldId = `${this.containerId}-field-${this.counter}`;
        
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'dynamic-list-field';
        
        let inputAttributes = `
            type="${this.inputType}" 
            id="${fieldId}" 
            class="dynamic-list-input"
            value="${value}" 
            placeholder="${this.placeholder}"
        `;
        
        if (this.min !== null) inputAttributes += ` min="${this.min}"`;
        if (this.max !== null) inputAttributes += ` max="${this.max}"`;

        fieldDiv.innerHTML = `
            <div class="input-group">
                <input ${inputAttributes} />
                <button type="button" class="remove-field-btn" data-field-id="${fieldId}">
                    ✕ Remover
                </button>
            </div>
        `;

        container.appendChild(fieldDiv);

        // Adicionar event listener para o botão de remover
        const removeButton = fieldDiv.querySelector('.remove-field-btn');
        removeButton.addEventListener('click', () => {
            this.removeField(fieldDiv);
        });

        this.counter++;
    }

    removeField(fieldDiv) {
        const container = document.getElementById(this.containerId);
        
        // Não permitir remover se é o último campo
        const remainingFields = container.querySelectorAll('.dynamic-list-field');
        if (remainingFields.length <= 1) {
            alert('Deve haver pelo menos um campo.');
            return;
        }

        fieldDiv.remove();
    }

    getValues() {
        const container = document.getElementById(this.containerId);
        const inputs = container.querySelectorAll('.dynamic-list-input');
        
        const values = [];
        inputs.forEach(input => {
            const value = this.inputType === 'number' ? parseFloat(input.value) : input.value.trim();
            if (this.inputType === 'number') {
                if (!isNaN(value)) {
                    values.push(value);
                }
            } else {
                if (value !== '') {
                    values.push(value);
                }
            }
        });

        // Remover duplicatas e ordenar (apenas para números)
        if (this.inputType === 'number') {
            return [...new Set(values)].sort((a, b) => a - b);
        }
        
        return [...new Set(values)];
    }

    validate(config) {
        const values = this.getValues();
        return this.validation(values, config);
    }
}
window.ConfigViewController = ConfigViewController;