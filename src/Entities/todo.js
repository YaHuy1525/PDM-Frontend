// todo.js
export class Todo {
  constructor(
    title, 
    description = '', 
    status = 'Ongoing', 
    dueDate = null, 
    createdAt = new Date(), 
    boardId = null, 
    userId = null, 
    labelId = null
  ) {
    this.title = title;
    this.description = description;
    this.status = status;

    this.dueDate = dueDate ? new Date(dueDate) : new Date();

    this.createdAt =createdAt ? new Date(createdAt) : new Date();
    
    this.boardId = boardId;
    this.userId = userId;
    this.labelId = labelId;
  }

  static fromJson(json) {
    const todo = new Todo(json.title, json.description, json.status, json.dueDate, json.createdAt, json.boardId, json.userId, json.labelId);
    // Add label info from response if available
    todo.labelName = json.labelName;
    todo.labelColor = json.labelColor;
    return todo;
  }

  toJson() {
    return {
      taskId: this.taskId,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      boardId: this.boardId,
      userId: this.userId || 1,
      labelId: this.labelId
    };
  }

  // Helper method to format date for display
  formatDueDate() {
    return this.dueDate ? this.dueDate.toLocaleDateString() : 'No due date';
  }

  // Helper method to check if task is overdue
  isOverdue() {
    return this.dueDate && this.dueDate < new Date() && this.status !== 'Done';
  }
}
