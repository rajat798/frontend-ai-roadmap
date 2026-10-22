import { tasks, RestaurantTask } from "../data/tasks";

type CreateTaskInput = {
    title: string,
    quantity?: number,
    unit?: string,
}

export const createTask = (task: CreateTaskInput): RestaurantTask  => {
    const {title, quantity, unit}  = task;
    const newTask:RestaurantTask = {
        id: crypto.randomUUID(),
        title,
        quantity,
        unit,
        status: "open"
    }
    tasks.push(newTask);
    return newTask;
};