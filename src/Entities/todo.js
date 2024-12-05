// todo.js
export class Todo {
  constructor(
    id = null,
    title,
    description = '',
    status = 'PENDING',
    dueDate = null,
    createdAt = new Date().toISOString(),
    boardId = null,
    userId = null,
    labelId = null
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.boardId = boardId;
    this.userId = userId;
    this.labelId = labelId;
  }

  static fromJson(json) {
    return new Todo(
      json.taskId,
      json.title,
      json.description,
      json.status,
      json.dueDate,
      json.createdAt,
      json.board?.boardId,
      json.user?.userId,
      json.label?.labelId
    );
  }

  toJson() {
    return {
      taskId: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      boardId: this.boardId,
      userId: this.userId,
      labelId: this.labelId
    };
  }
}
