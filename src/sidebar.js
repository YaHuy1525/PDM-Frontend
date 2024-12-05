import { showAddTodoModal } from './todoDetails.js';

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
            
            <div class="dropdown">
                <div class="dropdown-header">By Category</div>
                <div class="dropdown-content">
                    <div class="menu-item" data-category="WORK">Work</div>
                    <div class="menu-item" data-category="PERSONAL">Personal</div>
                    <div class="menu-item" data-category="SHOPPING">Shopping</div>
                    <div class="menu-item" data-category="OTHERS">Others</div>
                </div>
            </div>
            
            <button class="add-todo-btn">+ Add Todo</button>
        </div>
    `;

    const toggleBtn = sidebar.querySelector('.toggle-btn');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Make dropdowns clickable
    const dropdowns = sidebar.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const header = dropdown.querySelector('.dropdown-header');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                dropdown.classList.toggle('inactive');
            });
        }
    });

    // Add todo button
    const addTodoBtn = sidebar.querySelector('.add-todo-btn');
    addTodoBtn.addEventListener('click', showAddTodoModal);

    return sidebar;
}
