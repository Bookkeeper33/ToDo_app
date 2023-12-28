import Project from "./project";

export default class App {
    constructor() {
        this._inbox = new Project("Inbox");
        this._projects = [new Project("Test"), new Project("Eric")];
    }

    get inbox() {
        return this._inbox;
    }

    get projects() {
        return [this._inbox, ...this._projects];
    }

    get customProjects() {
        return this._projects;
    }

    getProject(projectName) {
        return this.#findProject(projectName);
    }

    addProject(projectTitle) {
        const newProject = new Project(projectTitle);
        this._projects.push(newProject);
    }

    removeProject(projectTitle) {
        this._projects = this._projects.filter(
            (project) => project.title !== projectTitle
        );
    }

    getToday() {
        const allProjects = [this._inbox, ...this._projects];
        const todayTasks = allProjects.flatMap((project) =>
            project.getTodayTasks()
        );

        return todayTasks.toSorted((a, b) => a.dueDate - b.dueDate);
    }

    getUpcoming() {
        const allProjects = [this._inbox, ...this._projects];
        const upcomingTasks = allProjects.flatMap((project) =>
            project.getUpcomingTasks()
        );

        return upcomingTasks.toSorted((a, b) => a.dueDate - b.dueDate);
    }

    changeProject(taskId, targetProjectTitle) {
        if (this.findProjectByTaskID(taskId).title === targetProjectTitle)
            return;

        const sourceProject = this.findProjectByTaskID(taskId);
        const targetProject =
            targetProjectTitle === "Inbox"
                ? this._inbox
                : this.#findProject(targetProjectTitle);
        const task = sourceProject.findTask(taskId);

        targetProject.addTask(task);
        sourceProject.removeTask(taskId);
    }

    findProjectByTaskID(id) {
        return [...this.projects, this.inbox].find((project) =>
            project.findTask(id)
        );
    }

    findTaskInProjects(taskId) {
        return [...this._projects, this._inbox].reduce((foundTask, project) => {
            return foundTask || project.findTask(taskId);
        }, undefined);
    }

    #findProject(targetTitle) {
        return this.projects.find((project) => project.title === targetTitle);
    }
}
