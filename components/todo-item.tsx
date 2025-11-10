"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TodoItemProps {
  todo: {
    id: string
    title: string
    completed: boolean
  }
  onToggleComplete: (id: string) => void
  onDeleteTodo: (id: string) => void
  onUpdateTodo: (id: string, title: string) => void
}

export default function TodoItem({ todo, onToggleComplete, onDeleteTodo, onUpdateTodo }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)
  const [isSaving, setIsSaving] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDeleteTodo(todo.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      setEditValue(todo.title)
      setIsEditing(false)
      return
    }

    if (editValue === todo.title) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onUpdateTodo(todo.id, editValue)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditValue(todo.title)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
        <Checkbox checked={todo.completed} disabled className="mt-0.5" />
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1"
          placeholder="Enter task title"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveEdit}
          disabled={isSaving}
          className="text-primary hover:bg-primary/10"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancelEdit}
          disabled={isSaving}
          className="text-muted-foreground hover:bg-secondary"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors group">
      <Checkbox checked={todo.completed} onCheckedChange={() => onToggleComplete(todo.id)} className="mt-0.5" />
      <span
        className={`flex-1 text-sm font-medium transition-all cursor-text ${
          todo.completed ? "line-through text-muted-foreground" : "text-foreground"
        }`}
        onClick={() => setIsEditing(true)}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10"
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  )
}
