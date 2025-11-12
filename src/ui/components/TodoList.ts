import type { Task } from "../../types/todo.types";


class TodoList {

    private container: HTMLElement;


    constructor() {
        this.container = document.querySelector('.tasks__list') as HTMLElement;
    }

    renderTask(tasks: Task[]): void {
        // Limpiamos el contenedor
        this.container.innerHTML = '';

        if(tasks.length === 0){
            
            return;
        }

        // Recorremos el array de tareas, para cada tarea creamos su HTML (con el metodo createTaskHTML) y lo unimos todo con join
        const tasksHTML = tasks.map(task => this.createTaskHTML(task)).join('');

        this.container.innerHTML = tasksHTML;
    }

    // Metodo Helper para "crear" Mayuscula a la primera letra de una palabra
    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    
    private createTaskHTML(task: Task): string {
        // Formateamos la fecha
        const date = new Date(task.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

        // Creamos esta conficional para "retornar" la clase correcta segun su prioridad
        const priorityClass =
            task.priority === 'high' ? 'tasks__priority-badge--high' :
            task.priority === 'medium' ? 'tasks__priority-badge--medium' :
            'tasks__priority-badge--low';

        // const priorityText = 
        //     task.priority === 'high' ? 'High' :
        //     task.priority === 'medium' ? 'Medium' :
        //     'Low'

        return `
            <li class="tasks__item ${task.checked ? 'tasks__item--completed' : ''}" data-id="${task.id}">
                <input 
                    class="tasks__checkbox" 
                    type="checkbox" 
                    name="task__checkbox" 
                    ${task.checked ? 'checked': ''}
                >

                <div class="tasks__info">
                    <div class="tasks__info-text">
                        <h3 class="tasks__title">${task.title}</h3>
                        <span class="tasks__priority-badge ${priorityClass}">${this.capitalize(task.priority)}</span>
                    </div>
                    <p class="tasks__description">${task.description}</p>
                    <p class="tasks__date">Created: ${formattedDate}</p>
                </div>

                <div class="tasks__btn">
                    <svg class="tasks__btn-edit" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>

                    <svg class="tasks__btn-delete" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </li>
        `
    }
}

export default TodoList;