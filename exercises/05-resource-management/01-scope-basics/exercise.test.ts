import { describe, expect, it } from "@effect/vitest"
import { Effect, Ref } from "effect"
import * as Exercise from "./exercise"

describe("01-scope-basics", () => {
	describe("withEnsuring", () => {
		it("should run finalizer on success", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					const value = yield* Exercise.withEnsuring(
						Effect.succeed("hello"),
						log,
					)
					const entries = yield* Ref.get(log)
					return { value, entries }
				}),
			)
			expect(result.value).toBe("hello")
			expect(result.entries).toContain("finalized")
		})

		it("should run finalizer on failure", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.withEnsuring(
						Effect.fail("boom") as Effect.Effect<string, string>,
						log,
					).pipe(Effect.catchAll(() => Effect.void))
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toContain("finalized")
		})
	})

	describe("managedResource", () => {
		it("should acquire and release within a scope", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Effect.scoped(Exercise.managedResource(log))
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toEqual(["acquired", "released"])
		})
	})

	describe("scopedResource", () => {
		it("should acquire, use, and release in order", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					const value = yield* Exercise.scopedResource(log)
					const entries = yield* Ref.get(log)
					return { value, entries }
				}),
			)
			expect(result.value).toBe("resource")
			expect(result.entries).toEqual(["acquired", "used", "released"])
		})
	})

	describe("addFinalizerExample", () => {
		it("should log 'Success' on successful completion", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					const value = yield* Exercise.addFinalizerExample(log)
					const entries = yield* Ref.get(log)
					return { value, entries }
				}),
			)
			expect(result.value).toBe("done")
			expect(result.entries).toContain("Success")
		})
	})

	describe("multipleResources", () => {
		it("should release in reverse order (LIFO)", async () => {
			const entries = await Effect.runPromise(
				Exercise.multipleResources(),
			)
			expect(entries).toEqual([
				"acquire:A",
				"acquire:B",
				"release:B",
				"release:A",
			])
		})
	})
})
