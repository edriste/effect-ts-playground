# 🧩 Effect + Next.js Showcase

This small project demonstrates how the **[Effect](https://effect.website)** library can bring **type-safe, composable, and reliable async effects** into a modern **Next.js + React** setup.

The app fetches **todos** and **user information** concurrently, showing how `Effect` helps organize side effects like:
- Async API calls
- Timeouts and retries
- Structured error handling
- Dependency injection

---

## 🚀 Overview

In a traditional React app, you’d use `useEffect`, `fetch`, and `try/catch` for async work.  
That’s fine for small cases — but once you add **parallel fetching**, **timeouts**, or **retries**, your code quickly becomes imperative and error-prone.

Effect provides a **pure, composable abstraction** for async logic.  
Instead of *doing* things directly, you *describe* effects that can later be run in a controlled, type-safe way.

---

## 🧱 Example: Todo Dashboard

### Without Effect

```ts
async function loadData() {
  try {
    const [todosRes, userRes] = await Promise.all([
      fetch("/todos"),
      fetch("/users/1"),
    ])
    const [todos, user] = await Promise.all([todosRes.json(), userRes.json()])
    setState({ todos, user })
  } catch (err) {
    setError(err)
  }
}
