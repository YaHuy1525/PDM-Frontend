import { showAddTodoModal } from './todoDetails.js';
import { todoApi } from './Service/todoService.js';
import { boardApi } from './Service/boardService.js';

export function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    
    sidebar.innerHTML = `
        <button class="toggle-btn">☰</button>
        <div class="sidebar-content">
            <div class="menu-item all">All Todos</div>
            
            <div class="dropdown">
                <div class="dropdown-header">By Time</div>
                <div class="dropdown-content">
                    <div class="menu-item" data-time="today">Today</div>
                    <div class="menu-item" data-time="thisWeek">This Week</div>
                    <div class="menu-item" data-time="thisMonth">This Month</div>
                </div>
            </div>
            
            <div class="boards-section">
                <div class="dropdown-header">Boards</div>
                <button class="add-board-btn">+ New Board</button>
                <div class="boards-list"></div>
            </div>
            
            <button class="add-todo-btn">+ Add Todo</button>
        </div>
    `;

    // Make dropdowns clickable
    const dropdowns = sidebar.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const header = dropdown.querySelector('.dropdown-header');
        header.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
    });

    // Toggle sidebar
    const toggleBtn = sidebar.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Add todo button
    const addTodoBtn = sidebar.querySelector('.add-todo-btn');
    addTodoBtn.addEventListener('click', async () => {
        try {
            const boards = await boardApi.getAllBoards();
            showAddTodoModal(boards);
        } catch (error) {
            console.error('Failed to fetch boards:', error);
            showAddTodoModal([]);
        }
    });

    // Add board button
    const addBoardBtn = sidebar.querySelector('.add-board-btn');
    addBoardBtn.addEventListener('click', () => {
        showAddBoardModal();
    });

    // Load and display boards
    const loadBoards = async () => {
        try {
            const boards = await boardApi.getAllBoards();
            const boardsList = sidebar.querySelector('.boards-list');
            boardsList.innerHTML = boards.map(board => `
                <div class="menu-item board-item" data-board-id="${board.boardId}">
                    ${board.name}
                </div>
            `).join('');

            // Add click handlers for board items
            boardsList.querySelectorAll('.board-item').forEach(boardItem => {
                boardItem.addEventListener('click', () => {
                    document.querySelectorAll('.menu-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    boardItem.classList.add('active');
                    const boardId = boardItem.dataset.boardId;
                    document.dispatchEvent(new CustomEvent('filterByBoard', {
                        detail: { boardId: parseInt(boardId) }
                    }));
                });
            });
        } catch (error) {
            console.error('Failed to load boards:', error);
        }
    };

    loadBoards();
    document.addEventListener('boardsUpdated', loadBoards);
    return sidebar;
}

export function showAddBoardModal() {
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
    
    modal.innerHTML = `
        <div class="modal-content" style="background: white; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%;">
            <div class="form-group">
                <input type="text" class="board-name-input" placeholder="Enter board name..." style="width: 100%; font-size: 1.2em; border: none; outline: none; border-bottom: 1px solid #ddd; padding: 8px 0;">
            </div>
            <div class="form-group">
                <label><strong>Description:</strong></label>
                <textarea class="board-description-input" placeholder="Describe your board here..." style="width: 100%; min-height: 60px; border: 1px solid #ddd; padding: 8px; resize: vertical;"></textarea>
            </div>
            <div class="modal-buttons" style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                <button class="save-btn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                <button class="cancel-btn" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    const nameInput = modal.querySelector('.board-name-input');
    const saveBtn = modal.querySelector('.save-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const description = modal.querySelector('.board-description-input').value.trim();

        if (!name) {
            alert('Board name is required!');
            return;
        }

        try {
            await boardApi.createBoard({ name, description });
            closeModal();
            document.dispatchEvent(new CustomEvent('boardsUpdated'));
        } catch (error) {
            console.error('Failed to create board:', error);
            alert('Failed to create board: ' + error.message);
        }
    });
}
