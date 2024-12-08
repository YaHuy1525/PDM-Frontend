import React, { useState, useEffect } from 'react';
import { List, message } from 'antd';
import TodoItem from './TodoItem';
import todoService from '../services/todoService';

export class Board {
    constructor(
        id = null,
        name,
        description = '',
        createdAt = new Date().toISOString(),
        tasks = []
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.tasks = tasks;
    }

    static fromJson(json) {
        return new Board(
            json.boardId,
            json.name,
            json.description,
            json.createdAt,
            json.tasks?.map(task => Todo.fromJson(task)) || []
        );
    }

    toJson() {
        return {
            boardId: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            tasks: this.tasks.map(task => task.toJson())
        };
    }
}

const BoardComponent = () => {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      message.error('Failed to fetch todos');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await todoService.deleteTodo(id);
      message.success('Todo deleted successfully');
      fetchTodos();
    } catch (error) {
      message.error('Failed to delete todo');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const updatedTodo = {
        id: todo.id,
        title: todo.title,
        completed: !todo.completed,
      };
      await todoService.updateTodo(todo.id, updatedTodo);
      fetchTodos();
    } catch (error) {
      message.error('Failed to update todo');
    }
  };

  return (
    <List
      loading={loading}
      dataSource={todos}
      renderItem={(todo) => (
        <TodoItem
          todo={todo}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      )}
    />
  );
};

export default BoardComponent;