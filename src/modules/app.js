import Project from "./project";

export default class App {
    constructor() {
        this._projects = [new Project("Inbox")];
    }

    get projects() {
        return this._projects;
    }

    getProject(projectName) {
        return this.#findProject(projectName);
    }

    addProject(projectTitle) {
        if (this.#findProject(projectTitle)) {
            console.log("Project already exist!");
            return;
        }

        const newProject = new Project(projectTitle);
        this.projects.push(newProject);
    }

    removeProject(projectTitle) {
        this.projects = this.projects.filter(
            (project) => project.title !== projectTitle
        );
    }

    getToday() {
        const todayTasks = this.projects.flatMap((project) =>
            project.getTodayTasks()
        );

        return todayTasks;
    }

    getUpcoming() {
        const upcomingTasks = this.projects.flatMap((project) =>
            project.getUpcomingTasks()
        );

        return upcomingTasks;
    }

    changeProject(taskTitle, sourceProjectTile, targetProjectTitle) {
        const sourceProject = this.#findProject(sourceProjectTile);
        const task = sourceProject.findTaskByTitle(taskTitle);
        const targetProject = this.#findProject(targetProjectTitle);

        targetProject.addTask(task);
        sourceProject.removeTask(taskTitle);
    }

    #findProject(targetTitle) {
        return this.projects.find((project) => project.title === targetTitle);
    }
}
