//
import { Project } from './project';
import { Todo } from './todo';

const STORAGE_KEY = 'todoAppProjects';

const saveProjects = (projects) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        console.log('Projects saved to localStorage.');
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
};

const loadProjects = () => {
    try {
        const storedProjects = localStorage.getItem(STORAGE_KEY);
        if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            // Reconstruct Project and Todo objects to restore methods
            return parsedProjects.map(projectData => {
                const project = new Project(projectData.name);
                project.id = projectData.id; 
                project.todos = projectData.todos.map(todoData => {
                    const todo = new Todo(
                        todoData.title,
                        todoData.description,
                        todoData.dueDate,
                        todoData.priority,
                        todoData.notes,
                        todoData.isComplete
                    );
                    todo.id = todoData.id; 
                    return todo;
                });
                return project;
            });
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        
        localStorage.removeItem(STORAGE_KEY);
    }
    return [];
};

const getDefaultProject = () => {
    const projects = loadProjects();
    if (projects.length === 0) {
        const defaultProject = new Project('Default Project');
        saveProjects([defaultProject]);
        return defaultProject;
    }
    return projects[0]; 
};

export { saveProjects, loadProjects, getDefaultProject };