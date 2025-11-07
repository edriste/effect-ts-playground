import TodoDashboard from "./components/TodoDashboard"

export default function HomePage() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Effect-TS Dashboard</h1>
      <TodoDashboard />
    </main>
  )
}
