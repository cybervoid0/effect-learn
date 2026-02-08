import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("03-parallel-execution", () => {
	describe("parallelAll", () => {
		it("should run all effects and collect results", async () => {
			const effects = [
				Effect.succeed(1),
				Effect.succeed(2),
				Effect.succeed(3),
			]

			const result = await Effect.runPromise(Exercise.parallelAll(effects))
			expect(result).toEqual([1, 2, 3])
		})

		it("should run delayed effects in parallel", async () => {
			const effects = [
				Effect.sleep("50 millis").pipe(Effect.as("a")),
				Effect.sleep("50 millis").pipe(Effect.as("b")),
				Effect.sleep("50 millis").pipe(Effect.as("c")),
			]

			const result = await Effect.runPromise(Exercise.parallelAll(effects))
			expect(result).toEqual(["a", "b", "c"])
		})
	})

	describe("parallelWithLimit", () => {
		it("should respect concurrency limit", async () => {
			const log: Array<string> = []

			const makeTask = (id: string) =>
				Effect.sync(() => log.push(`start:${id}`)).pipe(
					Effect.andThen(Effect.sleep("50 millis")),
					Effect.andThen(
						Effect.sync(() => {
							log.push(`end:${id}`)
							return id
						}),
					),
				)

			const effects = [
				makeTask("A"),
				makeTask("B"),
				makeTask("C"),
				makeTask("D"),
			]

			const result = await Effect.runPromise(
				Exercise.parallelWithLimit(effects, 2),
			)
			expect(result).toEqual(["A", "B", "C", "D"])
		})
	})

	describe("parallelForEach", () => {
		it("should process items in parallel", async () => {
			const items = [1, 2, 3, 4, 5]
			const fn = (n: number) =>
				Effect.sleep("10 millis").pipe(Effect.as(n * 2))

			const result = await Effect.runPromise(
				Exercise.parallelForEach(items, fn, 3),
			)
			expect(result).toEqual([2, 4, 6, 8, 10])
		})

		it("should work with single concurrency", async () => {
			const items = ["a", "b", "c"]
			const fn = (s: string) => Effect.succeed(s.toUpperCase())

			const result = await Effect.runPromise(
				Exercise.parallelForEach(items, fn, 1),
			)
			expect(result).toEqual(["A", "B", "C"])
		})
	})

	describe("validateAll", () => {
		it("should return all results when all succeed", async () => {
			const effects = [
				Effect.succeed(1),
				Effect.succeed(2),
				Effect.succeed(3),
			]

			const result = await Effect.runPromise(Exercise.validateAll(effects))
			expect(result).toEqual([1, 2, 3])
		})

		it("should collect ALL errors when some fail", async () => {
			const effects = [
				Effect.succeed(1),
				Effect.fail("error1"),
				Effect.succeed(3),
				Effect.fail("error2"),
			]

			const exit = await Effect.runPromiseExit(
				Exercise.validateAll(effects),
			)

			expect(Exit.isFailure(exit)).toBe(true)

			if (Exit.isFailure(exit)) {
				const errors = exit.cause.toString()
				expect(errors).toContain("error1")
				expect(errors).toContain("error2")
			}
		})

		it("should collect all errors, not just the first one", async () => {
			const effects = [
				Effect.fail("A"),
				Effect.fail("B"),
				Effect.fail("C"),
			]

			const exit = await Effect.runPromiseExit(
				Exercise.validateAll(effects),
			)

			expect(Exit.isFailure(exit)).toBe(true)

			if (Exit.isFailure(exit)) {
				const errors = exit.cause.toString()
				expect(errors).toContain("A")
				expect(errors).toContain("B")
				expect(errors).toContain("C")
			}
		})
	})

	describe("measureSpeedup", () => {
		it("should show parallel is faster than sequential", async () => {
			const effects = [
				Effect.sleep("100 millis"),
				Effect.sleep("100 millis"),
				Effect.sleep("100 millis"),
			]

			const result = await Effect.runPromise(
				Exercise.measureSpeedup(effects),
			)

			// Sequential should take ~300ms, parallel ~100ms
			expect(result.sequential).toBeGreaterThan(200)
			expect(result.parallel).toBeLessThan(200)
			expect(result.sequential).toBeGreaterThan(result.parallel)
		})
	})
})
