//
import { format, parseISO } from 'date-fns';

class Todo {
    constructor(title, description, dueDate, priority, notes = '', isComplete = false) {
        if (!title || !dueDate || !priority) {
            throw new Error('Todo requires title, due date, and priority.');
        }
        this.id = Date.now().toString(); 
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority; 
        this.notes = notes;
        this.isComplete = isComplete;
    }

    // Getters for formatted dates 
    get formattedDueDate() {
        if (this.dueDate) {
            
            const dateObj = typeof this.dueDate === 'string' ? parseISO(this.dueDate) : this.dueDate;
            return format(dateObj, 'MMM d, yyyy');
        }
        return 'No due date';
    }

    toggleComplete() {
        this.isComplete = !this.isComplete;
    }

    updateDetails({ title, description, dueDate, priority, notes }) {
        if (title) this.title = title;
        if (description !== undefined) this.description = description; 
        if (dueDate) this.dueDate = dueDate;
        if (priority) this.priority = priority;
        if (notes !== undefined) this.notes = notes; 
    }
}

export { Todo };