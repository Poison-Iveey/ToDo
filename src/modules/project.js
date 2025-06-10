//
class Project {
    constructor(name) {
        if (!name) {
            throw new Error('Project requires a name.');
        }
        this.id = Date.now().toString(); 
        this.name = name;
        this.todos = []; 
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }

    getTodoById(todoId) {
        return this.todos.find(todo => todo.id === todoId);
    }
}

export { Project };