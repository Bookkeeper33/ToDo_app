import { isToday, differenceInCalendarDays } from "date-fns";
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
        return this.#sortByDate(this.tasks);
    }

    set tasks(newTasks) {
        this.tasks = newTasks;
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.title === newTask.title)) return;

        this.tasks.push(newTask);
    }

    removeTask(id) {
        this.tasks = this.tasks.filter((task) => id !== task.id);
    }

    findTask(id) {
        return this.tasks.find((task) => task.id === id);
    }

    getTodayTasks() {
        return this.tasks.filter((task) => {
            return isToday(task.dueDate);
        });
    }

    getUpcomingTasks() {
        const MIN_DIFFERENCE = 7;

        return this.tasks.filter((task) => {
            const difference = differenceInCalendarDays(
                task.dueDate,
                new Date()
            );

            return difference >= MIN_DIFFERENCE;
        });
    }

    #sortByDate(tasks) {
        return tasks.toSorted((a, b) => a.dueDate - b.dueDate);
    }
}
