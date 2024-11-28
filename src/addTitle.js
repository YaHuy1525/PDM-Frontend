import myTodoIcon from './myTodoIcon.webp';

export function addTitle(title, parentElement) {
    const header = document.createElement('header');
    const h1 = document.createElement('h1');
    h1.textContent = title;

    const img = document.createElement('img');
    img.src = myTodoIcon;
    img.alt = 'Todo Icon';
    img.className = 'title-icon';

    header.appendChild(img);
    header.appendChild(h1);
    parentElement.appendChild(header);
}
