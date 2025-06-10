import './styles/style.css'; 
import { initializeAppData, getCurrentProject, getProjects } from './modules/appLogic';
import { renderProjects, setupProjectListeners } from './dom/projectDOM';
import { renderTodos } from './dom/todoDOM';
import { setupModalListeners } from './dom/modalDOM';

document.addEventListener('DOMContentLoaded', () => {
    initializeAppData(); 

    renderProjects(); 
    setupProjectListeners(); 

    setupModalListeners(); 

    const currentProject = getCurrentProject();
    if (currentProject) {
        renderTodos(currentProject.todos);
    } else {
        renderTodos([]); 
    }
});