import { todoApi } from './Service/todoService.js';
import { Todo } from './Entities/todo.js';
import { labelApi } from './Service/labelService.js';
import { boardApi } from './Service/boardService.js';

export async function showTodoModal(todo = null) {
    const isEditMode = todo !== null;
    const modal = document.createElement('div');
    modal.className = 'modal';
    const boards = await boardApi.getAllBoards();
    const labels = await labelApi.getAllLabels();

    modal.innerHTML = `
        <div class="modal-content">
            <form id="todo-form">
                <h2>${isEditMode ? 'Edit' : 'New'} Todo</h2>
                
                <div class="form-group">
                    <input type="text" name="title" class="title-input" placeholder="Todo title" 
                           value="${isEditMode ? todo.title : ''}" required>
                </div>

                <div class="flex-row">
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" name="dueDate" 
                               value="${isEditMode && todo.dueDate ? todo.dueDate.split('T')[0] : ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>Priority</label>
                        <select name="labelId">
                            <option value="">Select Priority</option>
                            ${labels.map(label => `
                                <option value="${label.labelId}" 
                                        ${isEditMode && todo.labelId === label.labelId ? 'selected' : ''}>
                                    ${label.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Board</label>
                    <select name="boardId">
                        <option value="">Select Board</option>
                        ${boards.map(board => `
                            <option value="${board.boardId}" 
                                    ${isEditMode && todo.boardId === board.boardId ? 'selected' : ''}>
                                ${board.name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3">${isEditMode ? todo.description : ''}</textarea>
                </div>

                <div class="modal-buttons">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">
                        ${isEditMode ? 'Update' : 'Add'} Todo
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#todo-form');
    const cancelBtn = modal.querySelector('.cancel-btn');

    function closeModal() {
        modal.remove();
    }

    cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const todoData = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('dueDate'),
            boardId: formData.get('boardId'),
            labelId: formData.get('labelId'),
            status: isEditMode ? todo.status : 'Ongoing'
        };

        if (!todoData.title) {
            alert('Title is required!');
            return;
        }

        try {
            if (isEditMode) {
                await todoApi.updateTodo(todo.taskId, todoData);
            } else {
                await todoApi.createTodo(todoData);
            }
            closeModal();
            // Trigger refresh of todo list
            document.dispatchEvent(new CustomEvent('todosUpdated'));
        } catch (error) {
            console.error(`Failed to ${isEditMode ? 'update' : 'create'} todo:`, error);
            alert(`Failed to ${isEditMode ? 'update' : 'create'} todo: ${error.message}`);
        }
    };
}

// Helper function to show add todo modal
export function showAddTodoModal() {
    showTodoModal();
}

// Helper function to show edit todo modal
export function showEditTodoModal(todo) {
    showTodoModal(todo);
}