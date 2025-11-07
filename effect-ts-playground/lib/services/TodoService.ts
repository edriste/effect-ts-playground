import { Effect, Layer, Context, Schedule } from "effect";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// Declarative service definition - effect describes work but doesn't executes it
export interface TodoService {
  readonly getTodos: Effect.Effect<Todo[], Error, never>;
}

// Tag used for dependency injection
export const TodoServiceTag = Context.GenericTag<TodoService>("TodoService");

export const TodoServiceLive = Layer.succeed(TodoServiceTag, {
  getTodos: Effect.gen(function* (_) {
    const todos = yield* _(
      Effect.tryPromise<Todo[], Error>({
        try: () =>
          fetch("https://jsonplaceholder.typicode.com/todos?_limit=5").then(
            (r) => r.json()
          ),
        catch: (e) => new Error(`Failed to fetch todos: ${String(e)}`),
      })
        // declarative Timeout
        .pipe(Effect.timeout("3 seconds"))
        // Retry logic — no manual loops or try/catch
        .pipe(Effect.retry(Schedule.recurs(2)))
    );

    return todos;
  }),
});
