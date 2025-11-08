import { v4 as uuid } from 'uuid';
import type { Task, Priority } from '../types/todo.types';
import { getTasks, saveTasks } from '../utils/storage';


class TodoManager {

    private tasks: Task[];

    constructor(){
        this.tasks = getTasks();
    }

    addTask(title: string, description: string, priority: Priority): void{
        const task: Task = {
            id : uuid(),
            title,
            description,
            priority,
            checked: false,
            createdAt: new Date(),
        }

        this.tasks.push(task);
        saveTasks(this.tasks);
    }

    deleteTask(id: string): boolean{
        const filteredTasks = this.tasks.filter((task) => task.id !== id);
        if(filteredTasks.length === this.tasks.length){
            return false;
        }

        this.tasks = filteredTasks;
        saveTasks(this.tasks);
        return true;
    }


    toggleTask(id: string): boolean{
        const taskFound = this.tasks.find((task)=> task.id === id);
        if(!taskFound) return false;

        taskFound.checked = !taskFound.checked;
        saveTasks(this.tasks);
        return true;
    }

    getAllTasks(): Task[]{
        return this.tasks;
    }
}