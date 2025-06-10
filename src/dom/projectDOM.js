//
import { getProjects, setCurrentProject, deleteProject, getCurrentProject } from '../modules/appLogic';
import { renderTodos } from './todoDOM';
import { openAddProjectModal } from './modalDOM';

const projectListElement = document.getElementById('project-list');
const addProjectButton = document.getElementById('add-project-btn');
const currentProjectTitleElement = document.getElementById('current-project-title');

const renderProjects = () => {
    projectListElement.innerHTML = ''; 

    const projects = getProjects();
    const currentProjectId = getCurrentProject() ? getCurrentProject().id : null;

    if (projects.length === 0) {
        projectListElement.innerHTML = '<p class="no-projects">No projects yet. Add one!</p>';
        currentProjectTitleElement.textContent = 'No Project Selected';
        return;
    }

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        if (project.id === currentProjectId) {
            projectItem.classList.add('active');
        }
        projectItem.dataset.projectId = project.id;

        const projectName = document.createElement('span');
        projectName.textContent = project.name;
        projectItem.appendChild(projectName);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-project-btn');
        deleteBtn.innerHTML = '&times;'; 
        deleteBtn.title = 'Delete Project';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent project selection when deleting
            if (confirm(`Are you sure you want to delete project "${project.name}" and all its todos?`)) {
                deleteProject(project.id);
                renderProjects();
                renderTodos(getCurrentProject() ? getCurrentProject().todos : []);
            }
        });
        projectItem.appendChild(deleteBtn);

        projectItem.addEventListener('click', () => {
            setCurrentProject(project.id);
            renderProjects(); // Re-render to highlight active project
            renderTodos(getCurrentProject().todos);
        });

        projectListElement.appendChild(projectItem);
    });

    // Update the main content title
    if (getCurrentProject()) {
        currentProjectTitleElement.textContent = getCurrentProject().name;
    } else {
        currentProjectTitleElement.textContent = 'No Project Selected';
    }
};

const setupProjectListeners = () => {
    if (addProjectButton) {
        addProjectButton.addEventListener('click', openAddProjectModal);
    } else {
        console.error('Add Project Button not found.');
    }
};


export { renderProjects, setupProjectListeners };
