import TodoModal from "./components/TodoModal";
import TodoManager from "../models/TodoManager";
import TodoList from "./components/TodoList";
import type { Priority, Task } from "../types/todo.types";
import { PriorityWeight } from "../types/todo.types";

/**
 * Clase principal de toda la aplicación.
 * Coordina la comunicación entre TodoManager (lógica), TodoModal (UI modal), 
 * y TodoList (renderizado), manteniendo el estado de filtros activos.
 */
class App {
    private todoManager: TodoManager;
    private todoModal: TodoModal;
    private todoList: TodoList;

    // Estado de filtros
    private currentFilter: string = 'default';
    private currentSort: string = 'default';
    private currentSearch: string = '';

    // Generamos instancias de TodoManager y TodoModal.
    constructor() {
        this.todoManager = new TodoManager();
        this.todoModal = new TodoModal();
        this.todoList = new TodoList();
        this.init();
    }

    // Inicializa todos los event listeners y renderiza el estado inicial
    init(): void {
        this.setupAddTaskButton();
        this.setupModalSubmit();
        this.setupTaskEvents();
        this.setupSearch();   
        this.setupFilters();
        this.setupSort();
        this.renderTasks();
    }

    // Configuracion del botón "Add Task" para abrir el modal
    setupAddTaskButton(): void {
        const addButton = document.querySelector('.todo__button-add') as HTMLButtonElement;
        // Agregamos un addEventListener que escuche cuando se le da click para llamar o emplear el metodo openModal de la clase TodoModal
        addButton.addEventListener('click', () => {
            this.todoModal.openModal();
        })
    }

    /**
     * Configuracion del envío del formulario del modal
     * Capturacion de los datos, creacion de la tarea y re-renderizado
     */
    setupModalSubmit() {
        const form = document.querySelector('#taskForm') as HTMLFormElement;

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenimos el comportamiento predeterminado del formulario

            // Guardamos en la constante data = el objeto que es retornado del metodo getFormData
            const data = this.todoModal.getFormData();

            // Verfificamos si viene vacio para prevenir la continuacion
            if (!data) return;
            const { title, description, priority } = data;

            this.todoManager.addTask(title, description, priority);
            this.todoModal.closeModal();
            this.renderTasks(); // Re-renderiza aplicando filtros activos
        });
    }

    /**
     * Configuracion de los eventos de las tareas individuales usando event delegation
     * Escucha en el contenedor padre para manejar tareas dinámicas
     */
    private setupTaskEvents(): void {
        const taskContainer = document.querySelector('.tasks__list') as HTMLElement;

        taskContainer.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Toggle checkbox (marcar/desmarcar como completada)
            if (target.classList.contains('tasks__checkbox')) {
                const taskItem = target.closest('.tasks__item') as HTMLElement;
                // Verificamos si taskItem no es null o undefine con (?.)
                const taskId = taskItem?.dataset.id; // Accedemos al atributo data 
                if (!taskId) return;

                this.todoManager.toggleTask(taskId);
                this.renderTasks(); // Re-renderiza manteniendo filtros activos
            }

            // Boton para Eliminar tarea
            if (target.closest('.tasks__btn-delete')) {
                const taskItem = target.closest('.tasks__item') as HTMLElement;
                const taskId = taskItem?.dataset.id;
                if (!taskId) return;

                if (confirm('Estas seguro de que quieres eliminar esta tarea?')) {
                    this.todoManager.deleteTask(taskId);
                    this.renderTasks(); // Re-renderiza manteniendo filtros activos
                }
            }
        })
    }

    /**
     * Configuracion de la búsqueda en tiempo real
     * Actualizacion del estado y re-renderiza con cada tecla presionada
     */
    private setupSearch(): void {
        const inputSearch = document.querySelector('.search__input') as HTMLInputElement;
        if (!inputSearch) return;

        inputSearch.addEventListener('input', () => {
            this.currentSearch = inputSearch.value.trim();
            this.renderTasks();
        });
    }

    // Configuracion  del filtro por estado (todas/completadas/pendientes)
    private setupFilters(): void {
        const filterSelect = document.querySelector('#filter-category') as HTMLSelectElement;
        if (!filterSelect) return;

        filterSelect.addEventListener('change', () => {
            this.currentFilter = filterSelect.value;
            this.renderTasks();
        });
    }

    // Configuracion del ordenamiento por prioridad
    private setupSort(): void {
        const sortSelect = document.querySelector('#sort-tasks') as HTMLSelectElement;
        if (!sortSelect) return;

        sortSelect.addEventListener('change', () => {
            this.currentSort = sortSelect.value;
            this.renderTasks();
        });
    }




    //! RENDERIZADO

    /**
     * Método central de renderizado
     * Aplica todos los filtros activos en cascada y renderiza el resultado
     * Se llama automáticamente cada vez que cambia el estado
     */
    renderTasks(): void {
        let tasks = this.todoManager.getAllTasks();

        // Ahora renderizamos las tareas en base al filtro aplicado en tiempo real
        tasks = this.applySearch(tasks);
        tasks = this.applyFilter(tasks);
        tasks = this.applySort(tasks);

        this.todoList.renderTask(tasks);
        this.updatePendingCount();
    }


    // MÉTODOS AUXILIARES DE FILTRADO
    // Aplica la búsqueda por título o descripción (case-insensitive)
    private applySearch(tasks: Task[]): Task[] {
        if (!this.currentSearch) return tasks;

        const searchLower = this.currentSearch.toLowerCase();

        return tasks.filter((task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
    }

    // Aplica el filtro por estado (completadas/pendientes)
    private applyFilter(tasks: Task[]): Task[] {
        if (this.currentFilter === 'default') return tasks;

        return tasks.filter((task) =>
            this.currentFilter === 'done' ? task.checked : !task.checked
        );
    }

    /**
     * Aplica el ordenamiento por prioridad usando "algoritmo de distancia"
     * Las tareas con la prioridad seleccionada aparecen primero,
     * luego el resto ordenado por cercanía al peso seleccionado
     */

    private applySort(tasks: Task[]): Task[] {
        if (this.currentSort === 'default') return tasks;

        const selectedWeight = PriorityWeight[this.currentSort as Priority];
        const tasksCopy = [...tasks]; // Copiar porque sort() muta el array

        return tasksCopy.sort((a, b) => {
            // Priorizar tareas con la prioridad seleccionada
            if (a.priority === this.currentSort && b.priority !== this.currentSort) {
                return -1; // 'a' va primero
            }
            if (b.priority === this.currentSort && a.priority !== this.currentSort) {
                return 1; // 'b' va primero
            }

            // Ordenar el resto por cercanía al peso seleccionado
            const weightA = PriorityWeight[a.priority];
            const weightB = PriorityWeight[b.priority];
            const distanceA = Math.abs(weightA - selectedWeight);
            const distanceB = Math.abs(weightB - selectedWeight);

            return distanceA - distanceB; // Menor distancia = más cerca
        });
    }

    /**
     * Actualiza el contador de tareas pendientes
     * Siempre cuenta del total, independiente de los filtros activos
     */
    private updatePendingCount() {
        const tasks = this.todoManager.getAllTasks();
        const pendingTasks = tasks.filter((task) => !task.checked);
        const count = pendingTasks.length;
        const counterElement = document.querySelector('.todo__remaining');
        if (!counterElement) return;

        counterElement.textContent = `${count === 1 ? 'Pending Task' : 'Pending Tasks'}: ${count}`;
    }
}

export default App;