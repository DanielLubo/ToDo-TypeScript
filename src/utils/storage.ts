import { STORAGE_KEY } from '../constants';
import type { Task } from '../types/todo.types';


export const saveTasks = (tasks: Task[]): void => {
    
    const jsonTasks = JSON.stringify(tasks);    
    // Guardamos en LocalStorage el "string" de array con su clave (key)
    localStorage.setItem(STORAGE_KEY, jsonTasks);   
}


export const getTasks = (): Task[] => { 
    // Con esta linea obtenemos el "string de array" guardado en LocalStorage atravez de su clave (key)
    const storedTasks = localStorage.getItem(STORAGE_KEY); 

    // Verificamos si se obtuvo algo, sino retornamos un array vacio
    if(!storedTasks) return []; 

    // Necesitamos convertir ese "string" del LocalStorage a su "estado original" Task[]
    const tasks: Task[] = JSON.parse(storedTasks); 

    // Es necesario tambien convertir el string de la propiedad createdAt a tipo Date
    // Mapeamos el array de tasks para obtener cada objeto por iteracion
    return tasks.map(task => ({     
        // Usamos spread para copiar todas las propiedades del objeto actual
        ...task,    
        // obtenemos o "destructuramos" la propiedad createdAt para que sea de tipo Date(pasandole como parametro el objeto task y su propiedad createdAt)
        createdAt: new Date(task.createdAt)     
    }));
};


export const clearTasks = (): void => {
    localStorage.removeItem(STORAGE_KEY);   
}