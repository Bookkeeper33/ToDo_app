import "./style.css";

import App from "./modules/app";
import Task from "./modules/task";

const app = new App();
const addProjectBtn = document.querySelector(".btn-project");
const dialog = document.getElementById("modal-project");

addProjectBtn.addEventListener("click", () => {
    dialog.showModal();
});
