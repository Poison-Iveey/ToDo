//
import { Project } from './project';
import { Todo } from './todo';
import { saveProjects, loadProjects, getDefaultProject } from './storage';

let projects = [];
let currentProject = null;

const initializeAppData = () => {
    projects = loadProjects();
    if (projects.length === 0) {
        const defaultProject = new Project('Default Project');
        projects.push(defaultProject);
        saveProjects(projects);
    }
    currentProject = projects[0]; // Set the first project as current by default
    console.log('App Data Initialized:', projects, 'Current Project:', currentProject);
};

const getProjects = () => projects;
const getCurrentProject = () => currentProject;

const setCurrentProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        currentProject = project;
        console.log('Current project set to:', currentProject.name);
        return true;
    }
    return false;
};

const addProject = (name) => {
    const newProject = new Project(name);
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
};

const deleteProject = (projectId) => {
    projects = projects.filter(p => p.id !== projectId);
    saveProjects(projects);
    // If the deleted project was the current one, set a new current project
    if (currentProject && currentProject.id === projectId) {
        currentProject = projects.length > 0 ? projects[0] : null;
    }
};

const addTodoToProject = (projectId, { title, description, dueDate, priority, notes }) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const newTodo = new Todo(title, description, dueDate, priority, notes);
        project.addTodo(newTodo);
        saveProjects(projects);
        return newTodo;
    }
    return null;
};

const deleteTodoFromProject = (projectId, todoId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.deleteTodo(todoId);
        saveProjects(projects);
        return true;
    }
    return false;
};

const toggleTodoComplete = (projectId, todoId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const todo = project.getTodoById(todoId);
        if (todo) {
            todo.toggleComplete();
            saveProjects(projects);
            return true;
        }
    }
    return false;
};

const updateTodoDetails = (projectId, todoId, newDetails) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const todo = project.getTodoById(todoId);
        if (todo) {
            todo.updateDetails(newDetails);
            saveProjects(projects);
            return true;
        }
    }
    return false;
};

export {
    initializeAppData,
    getProjects,
    getCurrentProject,
    setCurrentProject,
    addProject,
    deleteProject,
    addTodoToProject,
    deleteTodoFromProject,
    toggleTodoComplete,
    updateTodoDetails,
};