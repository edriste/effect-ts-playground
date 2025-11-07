"use client"

import React, { useEffect, useState } from "react"

interface Todo {
  id: number
  title: string
  completed: boolean
}

interface User {
  id: number
  name: string
  email: string
}

export default function TodoDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        setLoading(true)

        const [todosRes, userRes] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/todos?_limit=5"),
          fetch("https://jsonplaceholder.typicode.com/users/1"),
        ])

        if (!todosRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const [todosData, userData] = await Promise.all([
          todosRes.json(),
          userRes.json(),
        ])

        if (active) {
          setTodos(todosData)
          setUser(userData)
          setError(null)
        }
      } catch (err) {
        if (active) setError((err as Error).message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()

    return () => {
      active = false
    }
  }, [])

  if (loading) return <p>Loading dashboard...</p>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User: {user?.name}</h2>
      <h3 className="font-bold">Todos</h3>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="p-2 border rounded bg-gray-50">
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  )
}

// no type-safe async composition
// no automatic resource management & retries
// no dependency injection
// no deterministic, testable effects

// but

// simpler React code
                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                    
