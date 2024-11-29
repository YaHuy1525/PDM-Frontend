import { filterTodosByCategory } from './filterTodosByCategory';
import { filterTodosByTime } from './filterTodosByTime';
import { showNewTodoModal } from './todoDetails';

export function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <button class="toggle-btn"><i class="fas fa-bars"></i></button>
            <button class="settings-btn"><i class="fas fa-cog"></i></button>
        </div>
        <div class="sidebar-content">
            <div class="user-section dropdown">
                <div class="dropdown-header">
                    <i class="fas fa-user"></i>
                    <span>Username</span>
                </div>
            </div>
            <div class="all-todos-section">
                <div class="menu-item all"><i class="fas fa-list"></i>All Todos</div>
            </div>
            <div class="timeline-section dropdown">
                <div class="dropdown-header">
                    <i class="fas fa-calendar"></i>
                    <span>Timeline</span>
                </div>
                <div class="dropdown-content">
                    <div class="menu-item" data-time="today"><i class="fa-solid fa-calendar-day"></i>Today</div>
                    <div class="menu-item" data-time="thisWeek"><i class="fa-solid fa-calendar-week"></i>This Week</div>
                    <div class="menu-item" data-time="thisMonth"><i class="fa-solid fa-calendar-days"></i>This Month</div>
                </div>
            </div>
            <div class="categories-section dropdown">
                <div class="dropdown-header">
                    <i class="fas fa-tags"></i>
                    <span>Categories</span>
                </div>
                <div class="dropdown-content">
                    <div class="menu-item work"><i class="fas fa-briefcase"></i>Work</div>
                    <div class="menu-item study"><i class="fas fa-book"></i>Study</div>
                    <div class="menu-item personal"><i class="fas fa-person"></i>Personal</div>
                    <div class="menu-item add-category">
                        <i class="fas fa-plus"></i>Add Category
                    </div>
                </div>
            </div>
        </div>
        <div class="c">
            <button class="add-todo-btn">
                <i class="fas fa-plus"></i>
                <span>Add New Todo</span>
            </button>
        </div>
    `;

    // Add event listeners
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

    sidebar.querySelector('.menu-item.all').addEventListener('click', () => {
        filterTodosByCategory(null);
    });

    sidebar.querySelector('.menu-item.work').addEventListener('click', () => {
        filterTodosByCategory('work');
    });
    sidebar.querySelector('.menu-item.study').addEventListener('click', () => {
        filterTodosByCategory('study');
    });
    sidebar.querySelector('.menu-item.personal').addEventListener('click', () => {
        filterTodosByCategory('personal');
    });

    sidebar.querySelector('.menu-item[data-time="today"]').addEventListener('click', () => {
        filterTodosByTime('today');
    });
    sidebar.querySelector('.menu-item[data-time="thisWeek"]').addEventListener('click', () => {
        filterTodosByTime('thisWeek');
    });
    sidebar.querySelector('.menu-item[data-time="thisMonth"]').addEventListener('click', () => {
        filterTodosByTime('thisMonth');
    });

    const addTodoBtn = sidebar.querySelector('.add-todo-btn');
    addTodoBtn.addEventListener('click', () => {
        showNewTodoModal();
    });

    return sidebar;
}
