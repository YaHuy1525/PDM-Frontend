import { loadTodosFromLocalStorage, saveTodosToLocalStorage } from './loadTodos';
import { Todo } from './todo';

export function showTodoDetails(todoId) {
    const todos = loadTodosFromLocalStorage();
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) {
        console.error('Todo not found');
        return;
    }
    
    let modal = document.getElementById('todo-modal');
    if (!modal) {
        modal = createModal();
    }
    
    populateModal(modal, todo);
    modal.style.display = 'block';
}

export function showNewTodoModal() {
    let modal = document.getElementById('todo-modal');
    if (!modal) {
        modal = createModal();
    }
    
    const newTodo = new Todo(
        Date.now(),
        'Enter title here...',
        'Describe your task here...',
        new Date().toISOString().split('T')[0],
        'low',
        'Add any additional notes here...',
        'personal',
        false
    );
    
    populateModal(modal, newTodo);
    enableEditing(modal);
    
    // Handle placeholder text styling
    const editableElements = modal.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.classList.add('placeholder-text');
        
        element.addEventListener('focus', function() {
            if (element.textContent.includes('here...')) {
                element.textContent = '';
                element.classList.remove('placeholder-text');
            }
        });
        
        element.addEventListener('blur', function() {
            if (!element.textContent.trim()) {
                element.textContent = element.getAttribute('data-placeholder') || 'Enter text here...';
                element.classList.add('placeholder-text');
            }
        });
    });
    
    // Set placeholder text attributes
    modal.querySelector('.todo-title').setAttribute('data-placeholder', 'Enter title here...');
    modal.querySelector('.todo-description').setAttribute('data-placeholder', 'Describe your task here...');
    modal.querySelector('.todo-notes').setAttribute('data-placeholder', 'Add any additional notes here...');
    
    modal.querySelector('.edit-btn').style.display = 'none';
    modal.querySelector('.delete-btn').style.display = 'none';
    modal.querySelector('.save-btn').style.display = 'inline-block';
    modal.style.display = 'block';
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'todo-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
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
                <p><strong>Category: </strong>
                    <select class="todo-category" disabled>
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                        <option value="personal">Personal</option>
                    </select>
                </p>
                <p><strong>Notes: </strong><span class="todo-notes" contenteditable="false"></span></p>
            </div>
        </div>
    `;

    const closeBtn = modal.querySelector('.close');
    const editBtn = modal.querySelector('.edit-btn');
    const deleteBtn = modal.querySelector('.delete-btn');
    const saveBtn = modal.querySelector('.save-btn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        resetEditMode(modal);
    };

    editBtn.onclick = () => enableEditing(modal);
    deleteBtn.onclick = () => deleteTodo(modal);
    saveBtn.onclick = () => saveChanges(modal);

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetEditMode(modal);
        }
    };

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            resetEditMode(modal);
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            saveChanges(modal);
        }
    });

    document.body.appendChild(modal);
    return modal;
}

function enableEditing(modal) {
    const editables = modal.querySelectorAll('[contenteditable]');
    const inputs = modal.querySelectorAll('input, select');
    editables.forEach(el => el.contentEditable = 'true');
    inputs.forEach(el => el.disabled = false);
    
    modal.querySelector('.edit-btn').style.display = 'none';
    modal.querySelector('.delete-btn').style.display = 'none';
    modal.querySelector('.save-btn').style.display = 'inline-block';
}

function resetEditMode(modal) {
    const editables = modal.querySelectorAll('[contenteditable]');
    const inputs = modal.querySelectorAll('input, select');
    editables.forEach(el => el.contentEditable = 'false');
    inputs.forEach(el => el.disabled = true);
    
    modal.querySelector('.edit-btn').style.display = 'inline-block';
    modal.querySelector('.delete-btn').style.display = 'inline-block';
    modal.querySelector('.save-btn').style.display = 'none';
}

function deleteTodo(modal) {
    if (confirm('Are you sure you want to delete this todo?')) {
        try {
            const todos = loadTodosFromLocalStorage();
            const todoId = Number(modal.dataset.todoId);
            const filteredTodos = todos.filter(todo => todo.id !== todoId);
            
            saveTodosToLocalStorage(filteredTodos)
            
            const event = new CustomEvent('todosUpdated');
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Please try again.');
        }
    }
}

function saveChanges(modal) {
    try {
        const todos = loadTodosFromLocalStorage();
        const todoId = Number(modal.dataset.todoId);
        let todo = todos.find(t => t.id === todoId);
        
        const updatedData = {
            title: modal.querySelector('.todo-title').textContent.trim(),
            description: modal.querySelector('.todo-description').textContent.trim(),
            dueDate: modal.querySelector('.todo-date').value,
            priority: modal.querySelector('.todo-priority').value,
            category: modal.querySelector('.todo-category').value,
            notes: modal.querySelector('.todo-notes').textContent.trim()
        };

        if (!todo) {
            // This is a new todo
            todo = new Todo(
                todoId,
                updatedData.title,
                updatedData.description,
                updatedData.dueDate,
                updatedData.priority,
                updatedData.notes,
                updatedData.category,
                false
            );
            todos.push(todo);
        } else {
            // Update existing todo
            Object.assign(todo, updatedData);
        }
        
        saveTodosToLocalStorage(todos);
        resetEditMode(modal);
        modal.style.display = 'none';
        
        const event = new CustomEvent('todosUpdated');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Failed to save changes. Please try again.');
    }
}

function populateModal(modal, todo) {
    modal.dataset.todoId = todo.id;
    modal.querySelector('.todo-title').textContent = todo.title;
    modal.querySelector('.todo-description').textContent = todo.description || '';
    modal.querySelector('.todo-date').value = todo.dueDate;
    modal.querySelector('.todo-priority').value = todo.priority;
    modal.querySelector('.todo-category').value = todo.category;
    modal.querySelector('.todo-notes').textContent = todo.notes || '';
}