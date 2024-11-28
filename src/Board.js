import React, { useState, useEffect } from 'react';
import { List, message } from 'antd';
import TodoItem from './TodoItem';
import todoService from '../services/todoService';

const Board = () => {
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
      await todoService.updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed
      });
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

export default Board;