import App from "./app";
import Task from "./task";

import { format } from "date-fns";
import { nanoid } from "nanoid";

export default class UI {
    constructor() {
        this.app = new App();
        this.#init();
    }

    addProject(title) {
        if (this.app.getProject(title)) {
            alert("Project already exists!");
            return;
        }

        this.app.addProject(title);
        this.renderProject(title);
    }

    renderProject(title) {
        const customList = document.getElementById("custom-list");
        const item = document.createElement("li");
        const btn = document.createElement("button");
        const icon = document.createElement("i");

        item.classList.add("nav-link");
        btn.classList.add("btn");
        btn.id = title;
        icon.className = "icon fa-solid fa-hashtag";

        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(title));

        item.appendChild(btn);
        customList.appendChild(item);
    }

    displayProjects() {
        this.app.customProjects.forEach((project) =>
            this.renderProject(project.title)
        );
    }

    displayHeader(title) {
        const header = document.querySelector(".header");
        const h2 = document.createElement("h2");

        header.textContent = "";
        h2.textContent = title;

        header.appendChild(h2);
    }

    renderTask(task, list) {
        list.innerHTML += `<li class="item" id='${task.id}'>
                        <div class="item-check">
                            <input type="checkbox"  id="${task.id}" class="${
            task.priority
        }" />
                        </div>
                        <div class="item-info">
                            <div class="item-title">
                                <h2>${task.title}</h2>
                            </div>
                            <div class="item-date">
                                <i class="fa-regular fa-calendar-days"></i>
                                <p>${format(task.dueDate, "d MMM y")}</p>
                            </div>
                            <div class="item-description">
                                <p>${task.description}</p>
                            </div>
                        </div>
                        <div class="item-details">
                            <button class="task">
                                <i
                                    class="fa-solid fa-circle-info fa-2xl"
                                    style="color: #dd3153"
                                ></i>
                            </button>
                        </div>
                    </li>`;
    }

    createTask(title, description, dueDate, priority, project) {
        if (!title || !dueDate || !priority) {
            alert("Invalid task details. Please provide valid information.");
            return;
        }

        const task = new Task(
            nanoid(10),
            title,
            description,
            new Date(dueDate),
            priority
        );

        if (project === "Inbox") {
            this.app.inbox.addTask(task);
        } else {
            const customProject = this.app.getProject(project);
            if (customProject) {
                customProject.addTask(task);
            }
        }

        this.displayTasks();
    }

    displayTasks() {
        const list = document.querySelector(".list-items");
        const activeTab = document.querySelector(".btn.active").id;
        const renderTasks = (tasks) =>
            tasks.forEach((task) => this.renderTask(task, list));

        list.textContent = "";

        switch (document.querySelector(".btn.active").id) {
            case "inbox":
                renderTasks(this.app.inbox.tasks);
                break;
            case "today":
                renderTasks(this.app.getToday());
                break;
            case "upcoming":
                renderTasks(this.app.getUpcoming());
                break;
            default:
                const customProject = this.app.getProject(activeTab);
                if (customProject) {
                    renderTasks(customProject.tasks);
                }
        }
    }

    #init() {
        this.#createSkeletonMain();
        this.#initHandlers();
        this.displayHeader(this.app._inbox.title);
        this.displayProjects();
        this.#initMockTasks();
    }

    #initHandlers() {
        const DOM = this.#initDOMelements();

        DOM.taskList.addEventListener("click", (e) => {
            this.#onHandleDetailClick(e);
            this.#onHandleRemoveItem(e);
        });
        // Click event on the navigation
        DOM.nav.addEventListener("click", (e) => {
            this.#handleNavClick(e, DOM);
        });

        // Click event on the project dialog
        DOM.dialogProject.addEventListener("click", (e) =>
            this.#handleProjectDialogClick(e, DOM)
        );

        // Click event on the task dialog
        DOM.dialogTask.addEventListener("click", (e) =>
            this.#handleTaskDialogClick(e, DOM)
        );

        // Submit event on the project dialog
        DOM.dialogProject.addEventListener("submit", (e) =>
            this.#handleProjectDialogSubmit(e)
        );

        // Submit event on the task dialog
        DOM.dialogTask.addEventListener("submit", (e) =>
            this.#handleTaskDialogSubmit(e)
        );
    }

    // Event handlers
    #onHandleDetailClick(event) {
        const detail = event.target.closest(".task");
        const id = event.target.closest(".item").id;

        if (detail) {
            this.#editTaskDetails(id);
        }
    }

    #onHandleRemoveItem(event) {
        const checkbox = event.target.closest(".item-check");

        if (checkbox) {
            const task = event.target.closest(".item");
            const id = task.id;

            task.children[1].style.textDecoration = "line-through";

            setTimeout(() => {
                this.app.inbox.removeTask(id);
                this.app.projects.forEach((project) => {
                    project.removeTask(id);
                });
                task.remove();
            }, 2000);
        }
    }

    #handleNavClick(event, DOM) {
        const targetButton = event.target.closest(".btn");
        if (targetButton) {
            this.#onActiveLink(targetButton);
            this.displayHeader(targetButton.textContent);
            this.displayTasks();
        }

        if (event.target.closest(".btn-project")) {
            DOM.dialogProject.showModal();
        }

        if (event.target.closest(".btn-task")) {
            this.#openModal(DOM.dialogTask);
        }
    }

    #handleProjectDialogClick(event, DOM) {
        if (event.target.className.includes("btn-cancel")) {
            DOM.dialogProject.close();
        }
    }

    #handleTaskDialogClick(event, DOM) {
        if (
            event.target.className.includes("btn-cancel") ||
            event.target.textContent === "❌"
        ) {
            DOM.dialogTask.close();
        }
    }

    #handleProjectDialogSubmit(event) {
        const data = this.#convertToObject(event.target);

        this.addProject(data.projectName);
        event.target.reset();
    }

    #handleTaskDialogSubmit(event) {
        const data = this.#convertToObject(event.target);

        this.createTask(
            data.taskTitle,
            data.description,
            data.dueDate || new Date(),
            data.priority,
            data.project
        );

        event.target.reset();
    }

    #convertToObject(source) {
        const formData = new FormData(source);
        const data = Object.fromEntries(formData.entries());

        return data;
    }

    #initDOMelements() {
        const nav = document.getElementById("sidebar");
        const taskList = document.querySelector(".list-items");
        const dialogProject = document.getElementById("modal-project");
        const dialogTask = document.getElementById("modal-task");

        return { nav, taskList, dialogProject, dialogTask };
    }

    #createSkeletonMain() {
        const main = document.getElementById("content");
        const header = this.#createHeader();
        const container = this.#createTaskContainer();

        main.appendChild(header);
        main.appendChild(container);

        return main;
    }

    #createTaskContainer() {
        const container = document.createElement("div");
        const list = document.createElement("ul");

        container.classList.add("container");
        list.classList.add("list-items");

        container.appendChild(list);

        return container;
    }

    #createHeader() {
        const header = document.createElement("div");

        header.classList.add("header");

        return header;
    }

    #onActiveLink(targetEl) {
        const btns = document.querySelectorAll(".btn");

        btns.forEach((btn) => {
            btn.classList.remove("active");
        });

        targetEl.classList.add("active");
    }

    #handleTaskEditSubmit(id, event) {
        const data = this.#convertToObject(event);
        const task = [...this.app.projects, this.app.inbox].reduce(
            (foundTask, project) => {
                return foundTask || project.findTask(id);
            },
            undefined
        );

        task.title = data.taskTitle;
        task.description = data.description;
        task.dueDate = data.dueDate;
        task.priority = data.priority;

        this.app.changeProject(task.id, data.project);
        this.displayTasks();
    }

    #editTaskDetails(taskId) {
        const task = this.app.findTaskInProjects(taskId);

        if (!task) {
            console.error("Task not found");
            return;
        }

        const main = document.getElementById("content");
        const projects = this.app.projects.map((project) => project.title);
        const priorities = ["low", "medium", "high"];
        let currentProject = this.app.findProjectByTaskID(taskId).title;

        // Create the dialog element
        const taskDetailsDialog = this.#createTaskDetailsDialog();

        // Create the content for the dialog
        const dialogContent = this.#createTaskDetailsContent(
            currentProject,
            task,
            projects,
            priorities
        );

        // Add event listeners
        this.#setupTaskEditEventListeners(
            taskDetailsDialog,
            dialogContent,
            taskId
        );

        // Append close button and dialog content to the dialog element
        taskDetailsDialog.appendChild(dialogContent);

        // Append the dialog to the main content
        main.appendChild(taskDetailsDialog);

        // Show the dialog
        taskDetailsDialog.showModal();
    }

    #createTaskDetailsDialog() {
        const taskDetailsDialog = document.createElement("dialog");
        taskDetailsDialog.id = "task-details-dialog";
        return taskDetailsDialog;
    }

    #createTaskDetailsContent(currentProject, task, projects, priorities) {
        const dialogContent = document.createElement("div");
        dialogContent.classList.add("task-detail");
        // Populate dialog content with task details
        dialogContent.innerHTML = `
        <div class="task-header">
                 <h2>${currentProject}</h2>
                 <button class='close-button'><i class="fa-solid fa-circle-arrow-left fa-xl"></i></button>
             </div>
             <form id="task-edit-form" method='dialog'>
                 <div class="task">
                     <div class="task-left">
                         <div class="task-control">
                             <label for="taskTitle">Task</label>
                             <input
                                 type="text"
                                 id="taskTitle"
                                 name="taskTitle"
                                 placeholder="Task title"
                                 minlength="1"
                                 maxlength="20"
                                 required
                                 value='${task.title}'
                             />
                         </div>
                         <div class="task-control">
                             <label for="description">Description</label>
                             <textarea
                                 id="description"
                                 rows="5"
                                 cols="5"
                                 maxlength="400"
                                 placeholder="Description"
                                 name="description"
                             >${task.description}</textarea>
                         </div>
                     </div>
                     <div class="task-right">
                         <div class="task-control">
                             <label for="projects"></label>
                             <span>Project</span>
                             <select id="projects" name="project">
                                 ${projects.map(
                                     (project) =>
                                         `<option ${
                                             currentProject === project
                                                 ? "selected"
                                                 : ""
                                         } value="${project}">${project}</option>`
                                 )}
                            </select>
                        </div>
                        <div class="task-control">
                            <label for="date"></label>
                            <span>Due date</span>
                            <input type="date" name="dueDate" id="date" value=${format(
                                task.dueDate,
                                "yyyy-MM-dd"
                            )} />
                        </div>
                        <div class="task-control">
                            <label for="priority"></label>
                            <span>Priority</span>
                            <select id="priority" name="priority">
                                ${priorities.map(
                                    (priority) =>
                                        `<option ${
                                            priority === task.priority
                                                ? "selected"
                                                : ""
                                        } value="${priority}">${
                                            priority[0].toUpperCase() +
                                            priority.slice(1)
                                        }</option>`
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-buttons">
                    <button type='submit' class="btn-add ">Edit</button>
                    <button type="button" class="btn-cancel close-button">Cancel</button>
                </div>
            </form>
        </div>
        `;

        return dialogContent;
    }

    #setupTaskEditEventListeners(dialog, content, taskId) {
        const closeButtons = content.querySelectorAll(".close-button");

        dialog.addEventListener("submit", (e) => {
            this.#handleTaskEditSubmit(taskId, e.target);
            this.#closeAndRemoveDialog(dialog);
        });

        closeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                dialog.close();
                dialog.remove();
            });
        });
    }

    #closeAndRemoveDialog(dialog) {
        dialog.close();
        dialog.remove();
    }

    #openModal(modal) {
        const header = document.querySelector(".task-header h2");
        const select = document.getElementById("initProjects");

        select.innerHTML = "";

        this.app.projects.forEach((project) => {
            const option = document.createElement("option");
            option.value = project.title;
            option.text = project.title;
            select.appendChild(option);
        });

        select.addEventListener("change", (e) => {
            header.textContent = e.target.value;
        });

        modal.showModal();
    }

    #initMockTasks() {
        this.createTask(
            "Watch Netflix",
            "With girlfriend",
            new Date(),
            "low",
            "Inbox"
        );
        this.createTask(
            "Workout",
            "at home",
            new Date("1 Jan 2024"),
            "high",
            "Eric"
        );
        this.createTask(
            "Finish TO DO app",
            "Fucking tired",
            new Date("5 Jan 2024"),
            "high",
            "Inbox"
        );
    }
}
