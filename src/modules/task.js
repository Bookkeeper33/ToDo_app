import propValidation from "./simpleValidation";
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from "./constants";

export default class Task {
    constructor(id, title, description, dueDate, priority) {
        this._id = id;
        this._title = propValidation(title.length, MAX_TITLE_LENGTH)
            ? title
            : "Default";
        this._description = propValidation(
            description.length,
            MAX_DESCRIPTION_LENGTH
        )
            ? description
            : "No description";
        this._dueDate = dueDate;
        this._priority = priority;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    set title(newTitle) {
        if (!propValidation(newTitle.length, MAX_TITLE_LENGTH)) return;

        this._title = newTitle;
    }

    get description() {
        return this._description;
    }

    set description(newDescription) {
        if (!propValidation(newDescription.length, MAX_DESCRIPTION_LENGTH))
            return;

        this._description = newDescription;
    }

    get dueDate() {
        return this._dueDate;
    }

    set dueDate(newDueDate) {
        this._dueDate = newDueDate;
    }

    get priority() {
        return this._priority;
    }

    set priority(newPriority) {
        this._priority = newPriority;
    }
}
