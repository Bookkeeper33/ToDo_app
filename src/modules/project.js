import propValidation from "./simpleValidation";
import { MAX_TITLE_LENGTH } from "./constants";

export default class Project {
    tasks = [];

    constructor(title) {
        this.title = title;
    }

    get getTitle() {
        return this.title;
    }

    set setTitle(newTitle) {
        if (!propValidation(newTitle.length, MAX_TITLE_LENGTH)) return;
        this.title = newTitle;
    }

    get tasks() {
        return this.sortByDate(this.tasks);
    }

    set tasks(newTasks) {
        this.tasks = newTasks;
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.title === newTask.title)) return;

        this.tasks.push(newTask);
    }

    removeTask(taskTitle) {
        this.tasks = this.tasks.filter((task) => taskTitle !== task.title);
    }

    findTaskByTitle(taskTitle) {
        return this.tasks.find((task) => task.title === taskTitle);
    }

    sortByDate(tasks) {
        return tasks.toSorted((a, b) => a.dueDate - b.dueDate);
    }

    getTodayTasks() {
        return this.tasks.filter((task) => {
            const day = new Date().getDay();
            const month = new Date().getMonth();
            const year = new Date().getFullYear();

            return (
                task.dueDate.getDay() === day &&
                task.dueDate.getMonth() === month &&
                task.dueDate.getFullYear() === year
            );
        });
    }

    getUpcomingTasks() {
        return this.tasks.filter((task) => {
            const nextWeekDate = new Date(
                task.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            const currentDate = new Date();

            return task.dueDate > currentDate && task.dueDate <= nextWeekDate;
        });
    }
}
