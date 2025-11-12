import TodoModal from "./components/TodoModal";
import TodoManager from "../models/TodoManager";
import TodoList from "./components/TodoList";
import type { Priority, Task } from "../types/todo.types";
import { PriorityWeight } from "../types/todo.types";


class App {
    private todoManager: TodoManager;
    private todoModal: TodoModal;
    private todoList: TodoList;

    // Generamos instancias de TodoManager y TodoModal.
    constructor() {
        this.todoManager = new TodoManager();
        this.todoModal = new TodoModal();
        this.todoList = new TodoList();
        this.init();
    }

    // Metodo para emplear metodos que 
    init(): void{
        this.setupAddTaskButton();
        this.setupModalSubmit();
        this.setupTaskEvents();
        this.setupFilters();
        this.setupSort();
        this.renderTasks();
    }


    setupAddTaskButton(): void{
        const addButton = document.querySelector('.todo__button-add') as HTMLButtonElement;
        // Agregamos un addEventListener que escuche cuando se le da click para llamar o emplear el metodo openModal de la clase TodoModal
        addButton.addEventListener('click', () => {
            this.todoModal.openModal();
        })
    }


    setupModalSubmit(){
        
        const form = document.querySelector('#taskForm') as HTMLFormElement;
        
        form.addEventListener('submit', (e) => {
            // Prevenimos el comportamiento predeterminado del formulario
            e.preventDefault();

            // Guardamos en la constante data = el objeto que es retornado del metodo getFormData
            const data = this.todoModal.getFormData();

            // Verfificamos si viene vacio para prevenir la continuacion
            if(!data){
                return;
            }

            const {title, description, priority} = data;

            this.todoManager.addTask(title, description, priority);
            this.todoModal.closeModal();
            this.renderTasks();
        });
    }

    renderTasks(): void{
        const allTasks = this.todoManager.getAllTasks();
        this.todoList.renderTask(allTasks);
        this.updatePendingCount();
    }

    private setupTaskEvents(): void{
        const taskContainer = document.querySelector('.tasks__list') as HTMLElement;

        taskContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Validamos si el elemento contiene la clase de checkbox
            if(target.classList.contains('tasks__checkbox')){
                const taskItem = target.closest('.tasks__item') as HTMLElement;
                // Verificamos si taskItem no es null o undefine con (?.)
                const taskId = taskItem?.dataset.id; // Accedemos al atributo data 

                if(!taskId) return;

                this.todoManager.toggleTask(taskId);
                this.renderTasks();
            }

            if(target.closest('.tasks__btn-delete')){
                const taskItem = target.closest('.tasks__item') as HTMLElement;
                const taskId = taskItem?.dataset.id;

                if(!taskId) return;

                if(confirm('Estas seguro de que quieres eliminar esta tarea?')){
                    this.todoManager.deleteTask(taskId);
                    this.renderTasks();
                }
                
            }
        })
    }

    private updatePendingCount(){
        const tasks = this.todoManager.getAllTasks();
        const pendingTasks = tasks.filter((task) => !task.checked);
        const count = pendingTasks.length;
        const counterElement = document.querySelector('.todo__remaining');
        if(!counterElement) return;

        counterElement.textContent = `${count === 1 ? 'Pending Task' : 'Pending Tasks'}: ${count}`;
    }

    private setupFilters(): void {
        const filterSelect = document.querySelector('#filter-category') as HTMLSelectElement;

        if(!filterSelect) return;

        filterSelect.addEventListener('change', () => {
            const filterValue = filterSelect.value;
            const filteredTasks = this.getFilteredTasks(filterValue);

            this.todoList.renderTask(filteredTasks);
            this.updatePendingCount();
        });
    }

    private getFilteredTasks(filter: string): Task[]{
        const allTasks = this.todoManager.getAllTasks();

        if(filter === 'done'){
            return allTasks.filter((task) => task.checked === true);
        } else if(filter === 'todo'){
            return allTasks.filter((task) => !task.checked);
        } else{
            return allTasks;
        }
    }

    private setupSort(): void{
        const sortSelect = document.querySelector('#sort-tasks') as HTMLSelectElement;
        if(!sortSelect) return;

        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;

            const sortedTasks = this.getSortedTasks(sortValue);
            this.todoList.renderTask(sortedTasks);
            this.updatePendingCount();
        })
    }

    private getSortedTasks(sortBy: string): Task[]{
        const allTask = this.todoManager.getAllTasks();

        if(sortBy === 'default'){
            return allTask;
        }

        const tasksCopy = [...allTask];

        const selectedWeight = PriorityWeight[sortBy as Priority];

        // Casi todos sabemos querer....
        return tasksCopy.sort((a, b) => {
        // Priorizar la prioridad seleccionada
            if (a.priority === sortBy && b.priority !== sortBy) {
                return -1;
            }
            if (b.priority === sortBy && a.priority !== sortBy) {
                return 1;
            }
            
            const weightA = PriorityWeight[a.priority];
            const weightB = PriorityWeight[b.priority];
            
            const distanceA = Math.abs(weightA - selectedWeight);
            const distanceB = Math.abs(weightB - selectedWeight); 
            
            return distanceA - distanceB;
        });
    }


}

export default App;