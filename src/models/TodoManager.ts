import { v4 as uuid } from 'uuid';
import type { Task, Priority } from '../types/todo.types';
import { getTasks, saveTasks } from '../utils/storage';


class TodoManager {

    // Estado de la aplicacion (Array de tareas)
    private tasks: Task[];

    // En el constructor llamamos al metodo getTask que trae las tareas guardadas en localStorage
    constructor(){
        // Asignamos las tareas de localStorage al array del estado
        this.tasks = getTasks();
    }

    // Metodo para agregar o registrar una nueva tarea
    addTask(title: string, description: string, priority: Priority): void{
        // Creamos el objeto de tipo Task para registrar la tarea
        const task: Task = {
            id : uuid(),            // Propiedad generada "automaticamente"
            title,
            description,
            priority,
            checked: false,         // Propiedad generada "automaticamente"
            createdAt: new Date(),  // Propiedad generada "automaticamente"
        }

        // Agregamos la nueva tarea al array de estado (tasks: Task[])
        this.tasks.push(task);
        // Llamos o empleamos el metodo saveTasks para guardar el "nuevo estado del array de estado" en localStorage
        saveTasks(this.tasks);
    }

    // Metodo para eliminar tareas
    deleteTask(id: string): boolean{
        // Creamos un nuevo array "Exceptuando" la tarea que coincida con el id pasado como argumento
        const filteredTasks = this.tasks.filter((task) => task.id !== id);

        /**
         * Verificamos si el nuevo array efectivamente tuvo algun cambio en su longitud, 
         * Sino es asi eso quiere decir que no se "Elimino" alguna tarea, o no se encontro su id
         */
        if(filteredTasks.length === this.tasks.length){
            return false;
        }

        // Asignamos el nuevo array con la tarea "eliminada" al array de estado (tasks: Task[])
        this.tasks = filteredTasks;

        // Llamamos nuevamente al metodo para guardar el array en localStorage
        saveTasks(this.tasks);
        return true;
    }

    // Metodo para cambiar el estado "Checked" de una tarea
    toggleTask(id: string): boolean{
        // Buscamos la tarea por su id
        const taskFound = this.tasks.find((task)=> task.id === id);

        // Validacion por si no se llega a encontrar esa tarea
        if(!taskFound) return false;

        // Cambiamos el valor de la propiedad "checked" por su inverso
        taskFound.checked = !taskFound.checked;

        // Llamamos nuevamente al metodo para guardar el array en localStorage
        saveTasks(this.tasks);
        return true;
    }

    // Metodo para obtener todas las tareas
    getAllTasks(): Task[]{
        return this.tasks;
    }
}


export default TodoManager;