class Task {
  constructor(name, description, ifDone, owner, toDoListParent) {
    this.name = name;
    this.description = description;
    this.ifDone = ifDone;
    this.owner = owner;
    this.toDoListParent = toDoListParent;
  }
}

export default Task;
