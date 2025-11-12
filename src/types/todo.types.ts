export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    checked: boolean;
    createdAt: Date;
}

export type Priority = 'high' | 'medium' | 'low';

export enum PriorityWeight {
    low = 1,
    medium = 2,
    high = 3,
};