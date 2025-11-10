// Simple in-memory store for todos
// In production, replace with database queries

const todos: Array<{
  id: string
  title: string
  completed: boolean
  createdAt: Date
}> = []

let nextId = 1

export const todoStore = {
  getTodos: () => todos,

  addTodo: (title: string) => {
    const todo = {
      id: String(nextId++),
      title,
      completed: false,
      createdAt: new Date(),
    }
    todos.push(todo)
    return todo
  },

  updateTodo: (id: string, updates: Partial<{ title: string; completed: boolean }>) => {
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      Object.assign(todo, updates)
    }
    return todo
  },

  deleteTodo: (id: string) => {
    const index = todos.findIndex((t) => t.id === id)
    if (index !== -1) {
      const [deleted] = todos.splice(index, 1)
      return deleted
    }
  },
}
