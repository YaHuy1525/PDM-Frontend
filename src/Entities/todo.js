// todo.js
export class Todo {
  constructor(data = {}) {
    if (typeof data === 'object') {
      this.taskId = data.taskId || null;
      this.title = data.title || '';
      this.description = data.description || '';
      this.status = data.status || 'Ongoing';
      this.dueDate = data.dueDate || null;
      this.createdAt = data.createdAt || new Date().toISOString();
      this.boardId = data.boardId || null;
      this.userId = data.userId || null;
      this.labelId = data.labelId || null;
    }
  }

  static fromJson(json) {
    const todo = new Todo(json);
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
}
