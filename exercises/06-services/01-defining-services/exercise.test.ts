import { describe, it, expect } from "vitest"
import { Effect, Exit, HashMap, Ref } from "effect"
import {
	KeyNotFoundError,
	KeyValueStore,
	keyValueStoreLive,
	getOrDefault,
	setAndGet,
} from "./exercise"

describe("06-services / 01-defining-services", () => {
	describe("Exercise 1: KeyNotFoundError", () => {
		it("should be a tagged error with _tag 'KeyNotFoundError'", () => {
			const error = new KeyNotFoundError({ key: "missing" })
			expect(error._tag).toBe("KeyNotFoundError")
		})

		it("should carry the key field", () => {
			const error = new KeyNotFoundError({ key: "test-key" })
			expect(error.key).toBe("test-key")
		})
	})

	describe("Exercise 2: KeyValueStore service tag", () => {
		it("should have get, set, delete methods when provided", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				expect(typeof store.get).toBe("function")
				expect(typeof store.set).toBe("function")
				expect(typeof store.delete).toBe("function")
			})

			await Effect.runPromise(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
		})
	})

	describe("Exercise 3: keyValueStoreLive", () => {
		it("should set and get a value", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				yield* store.set("name", "Alice")
				return yield* store.get("name")
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(result).toBe("Alice")
		})

		it("should fail with KeyNotFoundError for missing key", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				return yield* store.get("nonexistent")
			})

			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(Exit.isFailure(exit)).toBe(true)

			if (Exit.isFailure(exit)) {
				const error = exit.cause
				expect(String(error)).toContain("KeyNotFoundError")
			}
		})

		it("should delete a key", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				yield* store.set("temp", "value")
				yield* store.delete("temp")
				return yield* store.get("temp")
			})

			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it("should overwrite existing values", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				yield* store.set("key", "first")
				yield* store.set("key", "second")
				return yield* store.get("key")
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(result).toBe("second")
		})

		it("should isolate state between layer provisions", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				return yield* store.get("key")
			})

			// Each provision creates a fresh Ref
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("Exercise 4: getOrDefault", () => {
		it("should return the value when key exists", async () => {
			const program = Effect.gen(function* () {
				const store = yield* KeyValueStore
				yield* store.set("greeting", "hello")
				return yield* getOrDefault("greeting", "fallback")
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(keyValueStoreLive)),
			)
			expect(result).toBe("hello")
		})

		it("should return default when key is missing", async () => {
			const result = await Effect.runPromise(
				getOrDefault("missing", "default-value").pipe(
					Effect.provide(keyValueStoreLive),
				),
			)
			expect(result).toBe("default-value")
		})
	})

	describe("Exercise 5: setAndGet", () => {
		it("should set a value and return it", async () => {
			const result = await Effect.runPromise(
				setAndGet("language", "TypeScript").pipe(
					Effect.provide(keyValueStoreLive),
				),
			)
			expect(result).toBe("TypeScript")
		})

		it("should work with empty string values", async () => {
			const result = await Effect.runPromise(
				setAndGet("empty", "").pipe(
					Effect.provide(keyValueStoreLive),
				),
			)
			expect(result).toBe("")
		})
	})
})
