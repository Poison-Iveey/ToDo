import { addTodoToProject, addProject, updateTodoDetails, getCurrentProject } from '../modules/appLogic';
import { renderTodos, renderTodoDetails } from './todoDOM';
import { renderProjects } from './projectDOM';
import { format, parseISO } from 'date-fns';

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalForm = document.getElementById('modal-form');
const closeModalBtn = document.querySelector('.close-button');
const addTodoBtn = document.getElementById('add-todo-btn');

let currentFormType = ''; 
let currentProjectId = null; 
let currentTodoId = null; 

const clearForm = () => {
    modalForm.innerHTML = '';
};

const closeModal = () => {
    modal.style.display = 'none';
    clearForm();
    currentFormType = '';
    currentProjectId = null;
    currentTodoId = null;
};

const createTextInput = (id, label, placeholder, value = '', required = false) => {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const lbl = document.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    div.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.name = id;
    input.placeholder = placeholder;
    input.value = value;
    input.required = required;
    div.appendChild(input);
    return div;
};

const createTextAreaInput = (id, label, placeholder, value = '', required = false) => {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const lbl = document.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    div.appendChild(lbl);

    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.name = id;
    textarea.placeholder = placeholder;
    textarea.value = value;
    textarea.required = required;
    div.appendChild(textarea);
    return div;
};

const createDateInput = (id, label, value = '', required = false) => {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const lbl = document.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    div.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'date';
    input.id = id;
    input.name = id;
    input.value = value;
    input.required = required;
    div.appendChild(input);
    return div;
};

const createSelectInput = (id, label, options, selectedValue = '', required = false) => {
    const div = document.createElement('div');
    div.classList.add('form-group');

    const lbl = document.createElement('label');
    lbl.setAttribute('for', id);
    lbl.textContent = label;
    div.appendChild(lbl);

    const select = document.createElement('select');
    select.id = id;
    select.name = id;
    select.required = required;

    options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText.toLowerCase();
        option.textContent = optionText;
        if (option.value === selectedValue.toLowerCase()) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    div.appendChild(select);
    return div;
};

const appendSubmitButton = () => {
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save';
    submitButton.classList.add('submit-btn');
    modalForm.appendChild(submitButton);
};


const openAddTodoModal = (projectId) => {
    currentFormType = 'addTodo';
    currentProjectId = projectId;
    modalTitle.textContent = 'Add New Todo';
    clearForm();

    modalForm.appendChild(createTextInput('todo-title', 'Title:', 'e.g., Buy groceries', '', true));
    modalForm.appendChild(createTextAreaInput('todo-description', 'Description:', 'e.g., Milk, eggs, bread', ''));
    modalForm.appendChild(createDateInput('todo-dueDate', 'Due Date:', '', true));
    modalForm.appendChild(createSelectInput('todo-priority', 'Priority:', ['Low', 'Medium', 'High'], 'medium', true));
    modalForm.appendChild(createTextAreaInput('todo-notes', 'Notes:', 'e.g., Check for discounts', ''));

    appendSubmitButton();
    modal.style.display = 'block';
};

const openEditTodoModal = (todo, projectId) => {
    currentFormType = 'editTodo';
    currentProjectId = projectId;
    currentTodoId = todo.id;
    modalTitle.textContent = 'Edit Todo';
    clearForm();

    const formattedDateForInput = todo.dueDate ? format(parseISO(todo.dueDate), 'yyyy-MM-dd') : '';

    modalForm.appendChild(createTextInput('todo-title', 'Title:', 'e.g., Buy groceries', todo.title, true));
    modalForm.appendChild(createTextAreaInput('todo-description', 'Description:', 'e.g., Milk, eggs, bread', todo.description));
    modalForm.appendChild(createDateInput('todo-dueDate', 'Due Date:', formattedDateForInput, true));
    modalForm.appendChild(createSelectInput('todo-priority', 'Priority:', ['Low', 'Medium', 'High'], todo.priority, true));
    modalForm.appendChild(createTextAreaInput('todo-notes', 'Notes:', 'e.g., Check for discounts', todo.notes));

    appendSubmitButton();
    modal.style.display = 'block';
};


const openAddProjectModal = () => {
    currentFormType = 'addProject';
    modalTitle.textContent = 'Add New Project';
    clearForm();

    modalForm.appendChild(createTextInput('project-name', 'Project Name:', 'e.g., Home Chores', '', true));

    appendSubmitButton();
    modal.style.display = 'block';
};

const handleFormSubmission = (event) => {
    event.preventDefault();

    if (currentFormType === 'addTodo') {
        const title = document.getElementById('todo-title').value;
        const description = document.getElementById('todo-description').value;
        const dueDate = document.getElementById('todo-dueDate').value;
        const priority = document.getElementById('todo-priority').value;
        const notes = document.getElementById('todo-notes').value;

        addTodoToProject(currentProjectId, { title, description, dueDate, priority, notes });
        renderTodos(getCurrentProject().todos);
        closeModal();
    } else if (currentFormType === 'editTodo') {
        const title = document.getElementById('todo-title').value;
        const description = document.getElementById('todo-description').value;
        const dueDate = document.getElementById('todo-dueDate').value;
        const priority = document.getElementById('todo-priority').value;
        const notes = document.getElementById('todo-notes').value;

        updateTodoDetails(currentProjectId, currentTodoId, { title, description, dueDate, priority, notes });
        renderTodos(getCurrentProject().todos); // Re-render the list
        // Re-render the expanded details if it's currently open
        const updatedTodo = getCurrentProject().getTodoById(currentTodoId);
        if (updatedTodo && document.getElementById('todo-details-view').dataset.todoId === currentTodoId) {
            renderTodoDetails(updatedTodo);
        }
        closeModal();
    } else if (currentFormType === 'addProject') {
        const projectName = document.getElementById('project-name').value;
        addProject(projectName);
        renderProjects();
        closeModal();
    }
};

const setupModalListeners = () => {
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    if (modalForm) {
        modalForm.addEventListener('submit', handleFormSubmission);
    }
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', () => {
            if (getCurrentProject()) {
                openAddTodoModal(getCurrentProject().id);
            } else {
                alert('Please select or create a project first!');
            }
        });
    } else {
        console.error('Add Todo Button not found.');
    }
};

export { openAddTodoModal, openAddProjectModal, openEditTodoModal, closeModal, setupModalListeners };