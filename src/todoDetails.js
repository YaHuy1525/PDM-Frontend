import TodoService from './todoService';
import { Todo } from './todo';

export async function showTodoDetails(todoId) {
    try {
        const todos = await TodoService.getAllTodos();
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
    } catch (error) {
        console.error('Error loading todo details:', error);
    }
}

export function showNewTodoModal() {
    let modal = document.getElementById('todo-modal');
    if (!modal) {
        modal = createModal();
    }
    
    const newTodo = new Todo(
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
            if (element.textContent.trim() === '') {
                element.textContent = element.getAttribute('data-placeholder') || 'Enter text here...';
                element.classList.add('placeholder-text');
            }
        });
    });
    
    modal.style.display = 'block';
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'todo-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="todo-details">
                <h2 id="todo-title" contenteditable="false"></h2>
                <div class="todo-metadata">
                    <div class="todo-field">
                        <label>Due Date:</label>
                        <input type="date" id="todo-due-date" disabled>
                    </div>
                    <div class="todo-field">
                        <label>Priority:</label>
                        <select id="todo-priority" disabled>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="todo-field">
                        <label>Category:</label>
                        <select id="todo-category" disabled>
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="shopping">Shopping</option>
                            <option value="health">Health</option>
                        </select>
                    </div>
                </div>
                <div class="todo-description">
                    <label>Description:</label>
                    <div id="todo-description-text" contenteditable="false"></div>
                </div>
                <div class="todo-notes">
                    <label>Notes:</label>
                    <div id="todo-notes-text" contenteditable="false"></div>
                </div>
                <div class="todo-actions">
                    <button id="edit-todo">Edit</button>
                    <button id="save-todo" style="display: none;">Save</button>
                    <button id="delete-todo">Delete</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        resetEditMode(modal);
    };
    

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetEditMode(modal);
        }
    };
    
    modal.querySelector('#edit-todo').onclick = () => enableEditing(modal);
    modal.querySelector('#save-todo').onclick = () => saveChanges(modal);
    modal.querySelector('#delete-todo').onclick = () => deleteTodo(modal);
    
    return modal;
}

//Enable editing
function enableEditing(modal) {
    modal.querySelector('#todo-title').contentEditable = 'true';
    modal.querySelector('#todo-description-text').contentEditable = 'true';
    modal.querySelector('#todo-notes-text').contentEditable = 'true';
    modal.querySelector('#todo-due-date').disabled = false;
    modal.querySelector('#todo-priority').disabled = false;
    modal.querySelector('#todo-category').disabled = false;
    modal.querySelector('#edit-todo').style.display = 'none';
    modal.querySelector('#save-todo').style.display = 'inline-block';
}
//Disable editing
function resetEditMode(modal) {
    modal.querySelector('#todo-title').contentEditable = 'false';
    modal.querySelector('#todo-description-text').contentEditable = 'false';
    modal.querySelector('#todo-notes-text').contentEditable = 'false';
    modal.querySelector('#todo-due-date').disabled = true;
    modal.querySelector('#todo-priority').disabled = true;
    modal.querySelector('#todo-category').disabled = true;
    modal.querySelector('#edit-todo').style.display = 'inline-block';
    modal.querySelector('#save-todo').style.display = 'none';
}

async function deleteTodo(modal) {
    const todoId = modal.getAttribute('data-todo-id');
    if (!todoId) {
        console.error('No todo ID found');
        return;
    }

    try {
        await TodoService.deleteTodo(todoId);
        modal.style.display = 'none';
        window.dispatchEvent(new CustomEvent('todosUpdated'));
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

async function saveChanges(modal) {
    const todoId = modal.getAttribute('data-todo-id');
    const title = modal.querySelector('#todo-title').textContent;
    const description = modal.querySelector('#todo-description-text').textContent;
    const dueDate = modal.querySelector('#todo-due-date').value;
    const priority = modal.querySelector('#todo-priority').value;
    const notes = modal.querySelector('#todo-notes-text').textContent;
    const category = modal.querySelector('#todo-category').value;

    const updatedTodo = {
        id: todoId ? parseInt(todoId) : Date.now(),
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
        priority: priority,
        notes: notes.trim(),
        category: category,
        isCompleted: false
    };

    try {
        if (todoId) {
            await TodoService.updateTodo(todoId, updatedTodo);
        } else {
            await TodoService.createTodo(updatedTodo);
        }

        resetEditMode(modal);
        modal.style.display = 'none';
        window.dispatchEvent(new CustomEvent('todosUpdated'));
    } catch (error) {
        console.error('Error saving todo:', error);
    }
}

function populateModal(modal, todo) {
    modal.setAttribute('data-todo-id', todo.id);
    modal.querySelector('#todo-title').textContent = todo.title;
    modal.querySelector('#todo-description-text').textContent = todo.description;
    modal.querySelector('#todo-due-date').value = todo.dueDate;
    modal.querySelector('#todo-priority').value = todo.priority;
    modal.querySelector('#todo-notes-text').textContent = todo.notes;
    modal.querySelector('#todo-category').value = todo.category;
}