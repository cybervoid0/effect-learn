import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"
import * as Exercise from "./exercise"

describe("01-fibers-basics", () => {
	describe("forkAndJoin", () => {
		it("should return the result of a successful effect", async () => {
			const result = await Effect.runPromise(
				Exercise.forkAndJoin(Effect.succeed(42)),
			)
			expect(result).toBe(42)
		})

		it("should return the result of a delayed effect", async () => {
			const result = await Effect.runPromise(
				Exercise.forkAndJoin(
					Effect.sleep("50 millis").pipe(
						Effect.andThen(Effect.succeed("delayed")),
					),
				),
			)
			expect(result).toBe("delayed")
		})

		it("should propagate errors via join", async () => {
			const exit = await Effect.runPromiseExit(
				Exercise.forkAndJoin(Effect.fail("boom")),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("forkAndAwait", () => {
		it("should return Exit.Success for a successful effect", async () => {
			const exit = await Effect.runPromise(
				Exercise.forkAndAwait(Effect.succeed("hello")),
			)
			expect(Exit.isSuccess(exit)).toBe(true)
		})

		it("should return Exit.Failure for a failed effect", async () => {
			const exit = await Effect.runPromise(
				Exercise.forkAndAwait(Effect.fail("error")),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})
	})

	describe("interruptFiber", () => {
		it("should return true after interrupting a fiber", async () => {
			const result = await Effect.runPromise(Exercise.interruptFiber())
			expect(result).toBe(true)
		})
	})

	describe("forkDaemons", () => {
		it("should return two fibers", async () => {
			const result = await Effect.runPromise(
				Exercise.forkDaemons(
					Effect.sleep("1 second").pipe(
						Effect.andThen(Effect.succeed("a")),
					),
					Effect.sleep("1 second").pipe(
						Effect.andThen(Effect.succeed("b")),
					),
				),
			)
			expect(result).toHaveLength(2)
			expect(result[0]).toBeDefined()
			expect(result[1]).toBeDefined()
		})
	})

	describe("checkFiberStatus", () => {
		it("should return true for a running/suspended fiber", async () => {
			const result = await Effect.runPromise(
				Exercise.checkFiberStatus(
					Effect.sleep("1 second").pipe(
						Effect.andThen(Effect.succeed("done")),
					),
				),
			)
			expect(result).toBe(true)
		})
	})
})
