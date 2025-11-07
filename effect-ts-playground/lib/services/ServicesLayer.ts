import { Layer } from "effect";
import { TodoServiceLive } from "./TodoService";
import { UserServiceLive } from "./UserService";

// Combine all live services into one environment (dependency injection)
export const AppLayer = Layer.mergeAll(TodoServiceLive, UserServiceLive);

// Layers are composable, swappable, and avoid global state
