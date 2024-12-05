// todo.js
export class Todo {
  constructor(id, title, description, dueDate, priority, completed, createdAt, updatedAt  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = completed; 
    this.category = createdAt;
    this.isCompleted = updatedAt;
  }

  toggleComplete() {
    this.isCompleted = !this.isCompleted;
  }
}
