import { Effect, Layer, Context } from "effect";

export interface User {
  id: number;
  name: string;
  email: string;
}

// Declarative service definition - effect describes work but doesn't executes it
export interface UserService {
  readonly getUser: (id: number) => Effect.Effect<User, Error, never>;
}

// Tag for dependency injection
export const UserServiceTag = Context.GenericTag<UserService>("UserService");

export const UserServiceLive = Layer.succeed(UserServiceTag, {
  getUser: (id: number) =>
    // Typed async boundary - Promise converted into a safe, typed Effect
    Effect.tryPromise<User, Error>({
      try: async () => {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return (await res.json()) as User;
      },
      // Errors are values, never thrown - caught in the Effect channel
      catch: (e) => new Error(`Failed to fetch user: ${String(e)}`),
    }),
});

// this entire implementation can be swapped out via Layer - ideal for testing or mocking without changing consumer code
