// todo.js
export class Todo {
  constructor(title, description, dueDate, status = 'pending', boardId = null, labelId = null, id = null) {
    if (id) this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.status = status;
    this.created_at = new Date().toISOString();
    this.board_id = boardId;
    this.label_id = labelId;
  }

  toggleStatus() {
    if (this.status === 'completed') {
      return 'completed';
    }
    else{
      return 'ongoing';
    }
  }
}

export class Board {
  constructor(name, description = '', id = null) {
    if (id) this.id = id;
    this.name = name;
    this.description = description;
    this.created_at = new Date().toISOString();
  }
}

export class Label {
  constructor(name, color = '#000000', id = null) {
    if (id) this.id = id;
    this.name = name;
    this.color = color;
  }
}
