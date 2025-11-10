import { todoStore } from "@/lib/todo-store"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const todos = todoStore.getTodos()
    return NextResponse.json(todos)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const todo = todoStore.addTodo(title.trim())
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
