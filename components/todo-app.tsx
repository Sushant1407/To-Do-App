"use client"

import { useState, useEffect } from "react"
import TodoForm from "./todo-form"
import TodoList from "./todo-list"
import { Card } from "@/components/ui/card"

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/todos")
      if (!response.ok) throw new Error("Failed to fetch todos")
      const data = await response.json()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (title: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error("Failed to create todo")
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add todo")
    }
  }

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      })

      if (!response.ok) throw new Error("Failed to update todo")
      const updated = await response.json()
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo")
    }
  }

  const handleUpdateTodo = async (id: string, title: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error("Failed to update todo")
      const updated = await response.json()
      setTodos(todos.map((t) => (t.id === id ? updated : t)))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo")
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete todo")
      setTodos(todos.filter((t) => t.id !== id))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo")
    }
  }

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">My Tasks</h1>
        <p className="text-muted-foreground">
          {completedCount} of {totalCount} completed
        </p>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      {/* Main Card */}
      <Card className="p-6 shadow-lg">
        {/* Add Todo Form */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Todo List or Loading State */}
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading your todos...</div>
        ) : todos.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-1">Add one to get started</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
          />
        )}
      </Card>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-6 px-6">
          <div className="bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
