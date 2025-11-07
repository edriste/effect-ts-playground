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
    let active = true // manual flag to prevent state updates after unmount

    async function loadData() {
      setLoading(true)
      setError(null)

      // 👇 Simulate an unreliable network (random failure)
      const simulateNetworkInstability = () => Math.random() < 0.4 // 40% chance to "fail"

      try {
        // Manual retry loop - duplicated logic
        let attempts = 0
        let todosRes: Response | null = null
        let userRes: Response | null = null

        while (attempts < 3) {
          try {
            // Manual timeout using AbortController
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 3000) // 3s

            // Run two parallel fetches
            const [tRes, uRes] = await Promise.all([
              fetch("https://jsonplaceholder.typicode.com/todos?_limit=5", {
                signal: controller.signal,
              }),
              fetch("https://jsonplaceholder.typicode.com/users/1", {
                signal: controller.signal,
              }),
            ])

            clearTimeout(timeout)

            // Artificial random network failure
            if (simulateNetworkInstability()) throw new Error("Network error")

            todosRes = tRes
            userRes = uRes
            break // success, stop retrying
          } catch (innerError) {
            attempts++
            console.warn(`Retry attempt ${attempts} failed:`, innerError)
            if (attempts >= 3) throw innerError // give up
          }
        }

        if (!todosRes?.ok || !userRes?.ok) {
          throw new Error("Bad response from API")
        }

        const [todosData, userData] = await Promise.all([
          todosRes.json(),
          userRes.json(),
        ])

        if (active) {
          setTodos(todosData)
          setUser(userData)
        }
      } catch (err) {
        // Unstructured, untyped error handling
        if (active) setError((err as Error).message)
      } finally {
        // Manual cleanup
        if (active) setLoading(false)
      }
    }

    loadData()

    // Manual teardown to prevent state updates on unmounted component
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p>Loading dashboard...</p>
  if (error)
    return (
      <p style={{ color: "red" }}>
        Error: {error} <br />
        (Simulated random failures + retries)
      </p>
    )

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
