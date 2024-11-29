import TodoService from './todoService';
export default class Todo {
    constructor(title, description = '', dueDate = null, priority = 'low', completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }

    static async createTodo(todoData) {
        try {
            return await TodoService.addTodo(new Todo(
                todoData.title,
                todoData.description,
                todoData.dueDate,
                todoData.priority
            ));
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    static async loadTodos() {
        try {
            return await TodoService.getAllTodos();
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }

    static async updateTodo(id, todoData) {
        try {
            return await TodoService.updateTodo(id, todoData);
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    static async deleteTodo(id) {
        try {
            return await TodoService.deleteTodo(id);
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }
}