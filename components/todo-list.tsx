"use client"

import TodoItem from "./todo-item"

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

interface TodoListProps {
  todos: Todo[]
  onToggleComplete: (id: string) => void
  onDeleteTodo: (id: string) => void
  onUpdateTodo: (id: string, title: string) => void
}

export default function TodoList({ todos, onToggleComplete, onDeleteTodo, onUpdateTodo }: TodoListProps) {
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </div>
  )
}
