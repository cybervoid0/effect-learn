import { Context, Data, Effect, HashMap, Layer, Option, Ref } from "effect"

// ============================================================
// Exercise 1: Define a tagged error for missing keys
// ============================================================

// Define KeyNotFoundError — a tagged error with a `key: string` field
// Hint: class ... extends Data.TaggedError("KeyNotFoundError")<{ ... }> {}

export class KeyNotFoundError extends Data.TaggedError(
	"KeyNotFoundError",
)<{}> {} // <-- Fix this: add the `key` field

// ============================================================
// Exercise 2: Define the KeyValueStore service tag
// ============================================================

// Define a Context.Tag called "KeyValueStore" with these methods:
//   get:    (key: string) => Effect.Effect<string, KeyNotFoundError>
//   set:    (key: string, value: string) => Effect.Effect<void>
//   delete: (key: string) => Effect.Effect<void>

export class KeyValueStore extends Context.Tag("KeyValueStore")<
	KeyValueStore,
	Record<string, never> // <-- Replace with the real interface
>() {}

// ============================================================
// Exercise 3: Create a live layer backed by Ref<HashMap>
// ============================================================

// Use Layer.effect to build a layer that:
// 1. Creates a Ref<HashMap<string, string>> as internal state
// 2. Returns an implementation of KeyValueStore using that Ref
//
// For `get`: read the HashMap, use HashMap.get (returns Option),
//            convert None → KeyNotFoundError
// For `set`: update the HashMap with HashMap.set
// For `delete`: update the HashMap with HashMap.remove

export const keyValueStoreLive: Layer.Layer<KeyValueStore> =
	Layer.succeed(KeyValueStore, {} as never) // <-- Replace with Layer.effect(...)

// ============================================================
// Exercise 4: Get a value or return a default
// ============================================================

// Write a program that:
// 1. Yields KeyValueStore
// 2. Calls store.get(key)
// 3. If KeyNotFoundError, returns defaultValue instead
export const getOrDefault = (
	key: string,
	defaultValue: string,
): Effect.Effect<string, never, KeyValueStore> => {
	// Your code here
	return Effect.succeed("TODO") as never
}

// ============================================================
// Exercise 5: Set a value, then read it back
// ============================================================

// Write a program that:
// 1. Yields KeyValueStore
// 2. Sets key to value
// 3. Gets the key back and returns the result
export const setAndGet = (
	key: string,
	value: string,
): Effect.Effect<string, KeyNotFoundError, KeyValueStore> => {
	// Your code here
	return Effect.succeed("TODO") as never
}
