import { todoApi } from './Service/todoService.js';
import { Todo } from './Entities/todo.js';

export function showNewTodoModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%;">
            <div class="modal-header">
                <h2 class="todo-title" contenteditable="false"></h2>
                <div class="modal-buttons">
                    <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
                    <button class="save-btn" style="display: none;"><i class="fas fa-save"></i> Save</button>
                    <span class="close">&times;</span>
                </div>
            </div>
            <div class="todo-details">
                <p><strong>Description: </strong><span class="todo-description" contenteditable="false"></span></p>
                <p><strong>Due Date: </strong><input type="date" class="todo-date" disabled></p>
                <p><strong>Priority: </strong>
                    <select class="todo-priority" disabled>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </p>
                <p><strong>Board: </strong><span class="todo-board" contenteditable="false"></span></p>
                <p><strong>Notes: </strong><span class="todo-notes" contenteditable="false"></span></p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#todo-form');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');

    function closeModal() {
        modal.remove();
    }

    closeBtn.onclick = closeModal;
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
            priority: formData.get('priority'),
            status: 'PENDING'
        };

        if (!todoData.title) {
            alert('Title is required!');
            return;
        }

        try {
            await todoApi.addTodo(todoData);
            closeModal();
            document.dispatchEvent(new CustomEvent('todosUpdated'));
        } catch (error) {
            console.error('Failed to create todo:', error);
            alert('Failed to create todo: ' + error.message);
        }
    };
}

export function showAddTodoModal(boards = []) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        display: flex;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.4);
        align-items: center;
        justify-content: center;
    `;
    
    const boardOptions = boards.map(board => 
        `<option value="${board.boardId}">${board.name}</option>`
    ).join('');
    
    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%; max-height: 90vh; overflow-y: auto;">
                <div class="form-group">
                <input type="text" class="title-input" placeholder="Enter title here..." style="width: 100%; font-size: 1.2em; border: none; outline: none; border-bottom: 1px solid #ddd; padding: 8px 0;">
                </div>
                <div class="form-group">
                <label><strong>Description:</strong></label>
                <textarea class="description-input" placeholder="Describe your task here..." style="width: 100%; min-height: 60px; border: 1px solid #ddd; padding: 8px; resize: vertical;"></textarea>
                </div>
            <div class="form-group" style="display: flex; gap: 20px;">
                <div style="flex: 1;">
                    <label><strong>Due Date:</strong></label>
                    <input type="date" class="date-input" style="width: 100%; padding: 4px;">
                </div>
                <div style="flex: 1;">
                    <label><strong>Priority:</strong></label>
                    <select class="priority-input" style="width: 100%; padding: 4px;">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                </div>
                <div class="form-group">
                <label><strong>Board:</strong></label>
                <select class="board-input" style="width: 100%; padding: 4px;" required>
                    <option value="">Select a board</option>
                    ${boardOptions}
                    </select>
                </div>
                <div class="form-group">
                <label><strong>Notes:</strong></label>
                <textarea class="notes-input" placeholder="Add any additional notes here..." style="width: 100%; min-height: 60px; border: 1px solid #ddd; padding: 8px; resize: vertical;"></textarea>
                </div>
            <div class="modal-buttons" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                <button class="save-btn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                <button class="cancel-btn" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    const titleInput = modal.querySelector('.title-input');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const saveBtn = modal.querySelector('.save-btn');
    const boardInput = modal.querySelector('.board-input');

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        const description = modal.querySelector('.description-input').value.trim();
        const dueDate = modal.querySelector('.date-input').value;
        const boardId = boardInput.value;
        const priority = modal.querySelector('.priority-input').value;

        console.log('Form values:', {
            title,
            description,
            dueDate,
            boardId,
            priority
        });

        if (!title) {
            alert('Title is required!');
            return;
        }

        if (!boardId) {
            alert('Please select a board!');
            return;
        }

        try {
            const labelId = getLabelId(priority);
            console.log('Converted values:', {
                boardId: parseInt(boardId),
                labelId,
                priority
            });

            const todoData = new Todo({
                title,
                description,
                dueDate,
                boardId: parseInt(boardId),
                labelId: parseInt(labelId),
                userId: 1,
                status: 'PENDING',
                createdAt: new Date().toISOString()
            });
            console.log('Final todo data:', todoData);
            await todoApi.createTodo(todoData);
            closeModal();
            document.dispatchEvent(new CustomEvent('todosUpdated'));
        } catch (error) {
            console.error('Failed to create todo:', error);
            alert('Failed to create todo: ' + error.message);
        }
    });

    function getLabelId(priority) {
        console.log('Converting priority:', priority);
        const id = priority.toLowerCase() === 'high' ? 1 :
                  priority.toLowerCase() === 'medium' ? 2 :
                  priority.toLowerCase() === 'low' ? 3 : 3;
        console.log('Converted to labelId:', id);
        return id;
    }

    titleInput.focus();
}

export function showTodoDetails(todoId) {

}