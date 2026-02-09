import { describe, expect, it } from "@effect/vitest"
import { Effect, Fiber, Ref } from "effect"
import * as Exercise from "./exercise"

describe("02-acquire-release", () => {
	describe("acquireUseRelease", () => {
		it("should open, read, and close the file", async () => {
			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					const content = yield* Exercise.acquireUseRelease(
						{ name: "test.txt", content: "hello world" },
						log,
					)
					const entries = yield* Ref.get(log)
					return { content, entries }
				}),
			)
			expect(result.content).toBe("hello world")
			expect(result.entries).toEqual(["open:test.txt", "close:test.txt"])
		})
	})

	describe("errorAwareRelease", () => {
		it("should commit on success", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.errorAwareRelease(
						Effect.succeed("ok"),
						log,
					)
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toEqual(["begin", "commit"])
		})

		it("should rollback on failure", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.errorAwareRelease(
						Effect.fail("boom"),
						log,
					).pipe(Effect.catchAll(() => Effect.void))
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toEqual(["begin", "rollback"])
		})
	})

	describe("onExitTracking", () => {
		it("should log 'success' on success", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.onExitTracking(Effect.succeed("ok"), log)
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toContain("success")
		})

		it("should log 'failure' on failure", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.onExitTracking(
						Effect.fail("boom"),
						log,
					).pipe(Effect.catchAll(() => Effect.void))
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toContain("failure")
		})
	})

	describe("onInterruptCleanup", () => {
		it("should log 'interrupted' when fiber is interrupted", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					const fiber = yield* Effect.fork(
						Exercise.onInterruptCleanup(Effect.never, log),
					)
					yield* Effect.yieldNow()
					yield* Fiber.interrupt(fiber)
					yield* Effect.yieldNow()
					return yield* Ref.get(log)
				}),
			)
			expect(entries).toContain("interrupted")
		})

		it("should NOT log 'interrupted' on normal completion", async () => {
			const entries = await Effect.runPromise(
				Effect.gen(function* () {
					const log = yield* Ref.make<ReadonlyArray<string>>([])
					yield* Exercise.onInterruptCleanup(Effect.void, log)
					return yield* Ref.get(log)
				}),
			)
			expect(entries).not.toContain("interrupted")
		})
	})

	describe("nestedResources", () => {
		it("should release inner before outer (LIFO)", async () => {
			const entries = await Effect.runPromise(
				Exercise.nestedResources(),
			)
			expect(entries).toEqual([
				"open:outer",
				"open:inner",
				"use",
				"close:inner",
				"close:outer",
			])
		})
	})
})
