"use client";

import React, { useMemo } from "react";
import { useEffectRun } from "@/lib/effects";
import { Effect } from "effect";
import { TodoServiceTag, Todo } from "@/lib/services/TodoService";
import { UserServiceTag } from "@/lib/services/UserService";
import { AppLayer } from "@/lib/services/ServicesLayer";

// Composable effect depending on multiple services
const getDashboardData = Effect.gen(function* (_) {
  const todoService = yield* _(TodoServiceTag);
  const userService = yield* _(UserServiceTag);

  // Parallel execution with typed concurrency
  const [todos, user] = yield* _(
    Effect.all([todoService.getTodos, userService.getUser(1)], {
      concurrency: "unbounded",
    })
  );

  return { todos, user };
}).pipe(
  // Structured error handling and logging
  Effect.tapError((err) => Effect.logError(`Dashboard load failed: ${err}`)),
  // Declarative dependency injection using unified API
  Effect.provide(AppLayer)
);

export default function TodoDashboard() {
  const effect = useMemo(() => getDashboardData, []);
  const { loading, error, data } = useEffectRun(effect);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {String(error)}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User: {data?.user.name}</h2>
      <h3 className="font-bold">Todos</h3>
      <ul className="space-y-2">
        {data?.todos.map((todo: Todo) => (
          <li key={todo.id} className="p-2 border rounded bg-gray-50">
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
