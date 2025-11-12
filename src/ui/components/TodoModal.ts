import type { Priority } from "../../types/todo.types";

class TodoModal {
    private modal: HTMLElement;

    constructor() {
        // Constructor se encarga de "cargar" el metodo que crea el modal dinamicamente
        this.modal = this.createModal();
        document.body.appendChild(this.modal);
        this.setupCloseEvents();
    }

    private createModal(): HTMLElement {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'taskModal';
        modal.innerHTML = `
            <div class="modal__overlay"></div>
                <div class="modal__content">
                    <!-- Header del Modal -->
                    <div class="modal__header">
                        <h2 class="modal__title" id="modalTitle">Add New Task</h2>
                        <button class="modal__close" id="closeModal">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Formulario -->
                    <form class="modal__form" id="taskForm">
                        <!-- Title -->
                        <div class="form__group">
                            <label class="form__label" for="taskTitle">Title *</label>
                            <input 
                                class="form__input" 
                                type="text" 
                                id="taskTitle" 
                                placeholder="Enter task title..."
                                required
                            >
                        </div>

                        <!-- Description -->
                        <div class="form__group">
                            <label class="form__label" for="taskDescription">Description *</label>
                            <textarea 
                                class="form__textarea" 
                                id="taskDescription" 
                                rows="4" 
                                placeholder="Enter task description..."
                                required
                            ></textarea>
                        </div>

                        <!-- Priority -->
                        <div class="form__group">
                            <label class="form__label" for="taskPriority">Priority *</label>
                            <div class="form__select-wrapper">
                                <select class="form__select" id="taskPriority" required>
                                    <option value="">Select priority...</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                                <svg class="form__select-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                                </svg>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="form__actions">
                            <button type="button" class="form__btn form__btn--cancel" id="cancelBtn">
                                Cancel
                            </button>
                            <button type="submit" class="form__btn form__btn--submit" id="submitBtn">
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            `
        return modal;
    }

    openModal(): void{
        this.modal.classList.add('active');
    }

    closeModal(): void{
        this.modal.classList.remove('active');
        this.clearForm(); // Limpiamos el "contenido" del modal
    }

    private clearForm(): void {
        const formModal = this.modal.querySelector('#taskForm') as HTMLFormElement;
        formModal.reset();
    }

    private setupCloseEvents(): void{
        const closeBtn = this.modal.querySelector('#closeModal') as HTMLButtonElement;
        const cancelBtn = this.modal.querySelector('#cancelBtn') as HTMLButtonElement;
        const clickOverlay = this.modal.querySelector('.modal__overlay') as HTMLElement;

        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', ()=> this.closeModal());
        clickOverlay.addEventListener('click', ()=> this.closeModal());
    }


    getFormData(): {title: string; description: string; priority: Priority} | null{
        const titleInput = this.modal.querySelector('#taskTitle') as HTMLInputElement;
        const descriptionInput = this.modal.querySelector('#taskDescription') as HTMLTextAreaElement;
        const select = this.modal.querySelector('#taskPriority') as HTMLSelectElement;

        // Eliminamos los espacios vacios o en blanco
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const priority = select.value as Priority;

        // Verificamos que los valores no vengan vacios o 0 para
        if(!title || !description || !priority){
            return null;
        };

        // Retornamos el objeto necesario para la creacion de una tarea (title, description y priority)
        return {
            title,
            description,
            priority,
        };
    }
}


export default TodoModal;