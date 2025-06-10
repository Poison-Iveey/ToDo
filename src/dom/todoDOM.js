
import { getCurrentProject, toggleTodoComplete, deleteTodoFromProject } from '../modules/appLogic';
import { openEditTodoModal } from './modalDOM';

const todoListElement = document.getElementById('todo-list');
const todoDetailsElement = document.getElementById('todo-details-view');

const renderTodos = (todos) => {
    todoListElement.innerHTML = '';
    todoDetailsElement.innerHTML = ''; 

    if (!todos || todos.length === 0) {
        todoListElement.innerHTML = '<p class="no-todos">No todos in this project yet. Add one!</p>';
        return;
    }

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item', `priority-${todo.priority}`);
        if (todo.isComplete) {
            todoItem.classList.add('complete');
        }
        todoItem.dataset.todoId = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.isComplete;
        checkbox.addEventListener('change', () => {
            toggleTodoComplete(getCurrentProject().id, todo.id);
            todoItem.classList.toggle('complete');
            // Re-render the specific todo details if it's currently displayed
            if (todoDetailsElement.dataset.todoId === todo.id) {
                renderTodoDetails(todo);
            }
        });
        todoItem.appendChild(checkbox);

        const titleAndDate = document.createElement('div');
        titleAndDate.classList.add('todo-info');
        const titleSpan = document.createElement('span');
        titleSpan.classList.add('todo-title');
        titleSpan.textContent = todo.title;
        titleAndDate.appendChild(titleSpan);

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('todo-duedate');
        dateSpan.textContent = todo.formattedDueDate;
        titleAndDate.appendChild(dateSpan);
        todoItem.appendChild(titleAndDate);


        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('todo-actions');

        const expandBtn = document.createElement('button');
        expandBtn.classList.add('expand-todo-btn');
        expandBtn.innerHTML = '&#x2192;'; 
        expandBtn.title = 'View Details';
        expandBtn.addEventListener('click', () => {
            renderTodoDetails(todo);
        });
        actionsContainer.appendChild(expandBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-todo-btn');
        deleteBtn.innerHTML = '&times;'; 
        deleteBtn.title = 'Delete Todo';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${todo.title}"?`)) {
                deleteTodoFromProject(getCurrentProject().id, todo.id);
                renderTodos(getCurrentProject().todos); 
            }
        });
        actionsContainer.appendChild(deleteBtn);

        todoItem.appendChild(actionsContainer);
        todoListElement.appendChild(todoItem);
    });
};

const renderTodoDetails = (todo) => {
    todoDetailsElement.innerHTML = '';
    todoDetailsElement.dataset.todoId = todo.id; 

    const detailHeader = document.createElement('h3');
    detailHeader.textContent = todo.title;
    todoDetailsElement.appendChild(detailHeader);

    const descriptionPara = document.createElement('p');
    descriptionPara.innerHTML = `<strong>Description:</strong> ${todo.description || 'N/A'}`;
    todoDetailsElement.appendChild(descriptionPara);

    const dueDatePara = document.createElement('p');
    dueDatePara.innerHTML = `<strong>Due Date:</strong> ${todo.formattedDueDate}`;
    todoDetailsElement.appendChild(dueDatePara);

    const priorityPara = document.createElement('p');
    priorityPara.innerHTML = `<strong>Priority:</strong> <span class="priority-${todo.priority}">${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>`;
    todoDetailsElement.appendChild(priorityPara);

    const notesPara = document.createElement('p');
    notesPara.innerHTML = `<strong>Notes:</strong> ${todo.notes || 'N/A'}`;
    todoDetailsElement.appendChild(notesPara);

    const completeStatus = document.createElement('p');
    completeStatus.innerHTML = `<strong>Status:</strong> <span class="${todo.isComplete ? 'complete-status' : 'incomplete-status'}">${todo.isComplete ? 'Complete' : 'Incomplete'}</span>`;
    todoDetailsElement.appendChild(completeStatus);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo-btn');
    editBtn.textContent = 'Edit Todo';
    editBtn.addEventListener('click', () => {
        openEditTodoModal(todo, getCurrentProject().id);
    });
    todoDetailsElement.appendChild(editBtn);
};

export { renderTodos, renderTodoDetails };