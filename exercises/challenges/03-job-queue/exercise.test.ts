import { describe, it, expect } from "vitest"
import { Effect, Either } from "effect"
import {
	JobNotFound,
	QueueShutdown,
	JobError,
	JobQueue,
	jobQueueLive,
	submitAndProcess,
	submitAfterShutdown,
} from "./exercise"

const CONCURRENCY = 2

const withQueue = <A, E>(
	program: Effect.Effect<A, E, JobQueue>,
): Effect.Effect<A, E, never> =>
	program.pipe(
		Effect.provide(jobQueueLive(CONCURRENCY)),
		Effect.scoped,
	)

describe("challenges / 03-job-queue", () => {
	describe("Errors", () => {
		it("JobNotFound should carry id", () => {
			const error = new JobNotFound({ id: "123" })
			expect(error._tag).toBe("JobNotFound")
			expect(error.id).toBe("123")
		})

		it("QueueShutdown should be tagged", () => {
			const error = new QueueShutdown()
			expect(error._tag).toBe("QueueShutdown")
		})
	})

	describe("JobQueue service", () => {
		it("should submit and retrieve job status", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.submit("job-1", Effect.succeed("result"))
				return yield* queue.getStatus("job-1")
			})
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("pending")
		})

		it("should fail with JobNotFound for unknown job", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				return yield* queue.getStatus("nonexistent").pipe(
					Effect.catchTag("JobNotFound", (e) =>
						Effect.succeed(`not-found:${e.id}`),
					),
				)
			})
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("not-found:nonexistent")
		})

		it("should process pending jobs and update status", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.submit("j1", Effect.succeed("ok"))
				yield* queue.processAll
				return yield* queue.getStatus("j1")
			})
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("completed")
		})

		it("should mark failed jobs as failed", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.submit("j-fail", Effect.fail("boom"))
				yield* queue.processAll
				return yield* queue.getStatus("j-fail")
			})
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("failed")
		})

		it("processAll should return Either results", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.submit("ok-1", Effect.succeed("good"))
				yield* queue.submit("fail-1", Effect.fail("bad"))
				return yield* queue.processAll
			})
			const result = await Effect.runPromise(withQueue(program))
			const rights = result.filter(Either.isRight)
			const lefts = result.filter(Either.isLeft)
			expect(rights).toHaveLength(1)
			expect(lefts).toHaveLength(1)
		})

		it("should reject submissions after shutdown", async () => {
			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.shutdown
				return yield* queue
					.submit("late", Effect.succeed("x"))
					.pipe(
						Effect.catchTag("QueueShutdown", () =>
							Effect.succeed("rejected"),
						),
					)
			})
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("rejected")
		})

		it("should not re-process already completed jobs", async () => {
			let callCount = 0
			const tracked = Effect.sync(() => {
				callCount++
				return "done"
			})

			const program = Effect.gen(function* () {
				const queue = yield* JobQueue
				yield* queue.submit("once", tracked)
				yield* queue.processAll
				yield* queue.processAll
				return yield* queue.getStatus("once")
			})

			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("completed")
			expect(callCount).toBe(1)
		})
	})

	describe("submitAndProcess", () => {
		it("should submit, process, and return statuses", async () => {
			const program = submitAndProcess([
				{ id: "a", execute: Effect.succeed("1") },
				{ id: "b", execute: Effect.succeed("2") },
				{ id: "c", execute: Effect.fail("oops") },
			])

			const result = await Effect.runPromise(withQueue(program))
			expect(result).toHaveLength(3)

			const statusMap = Object.fromEntries(
				result.map((r) => [r.id, r.status]),
			)
			expect(statusMap.a).toBe("completed")
			expect(statusMap.b).toBe("completed")
			expect(statusMap.c).toBe("failed")
		})
	})

	describe("submitAfterShutdown", () => {
		it("should return QueueShutdown tag", async () => {
			const program = submitAfterShutdown(
				"test",
				Effect.succeed("value"),
			)
			const result = await Effect.runPromise(withQueue(program))
			expect(result).toBe("QueueShutdown")
		})
	})
})
