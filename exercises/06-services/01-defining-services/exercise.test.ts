import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import * as Exercise from "./exercise"

describe("01-defining-services", () => {
	describe("RandomService", () => {
		it("should be a valid service tag", () => {
			expect(Exercise.RandomService).toBeDefined()
		})

		it("should be usable with Layer.succeed", async () => {
			const testLayer = Layer.succeed(Exercise.RandomService, {
				next: Effect.succeed(0.42),
			})
			const program = Effect.gen(function* () {
				const random = yield* Exercise.RandomService
				return yield* random.next
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(testLayer)),
			)
			expect(result).toBe(0.42)
		})
	})

	describe("LoggerService", () => {
		it("should be a valid service tag", () => {
			expect(Exercise.LoggerService).toBeDefined()
		})

		it("should be usable with Layer.succeed", async () => {
			const messages: string[] = []
			const testLayer = Layer.succeed(Exercise.LoggerService, {
				log: (message: string) =>
					Effect.sync(() => {
						messages.push(message)
					}),
			})
			const program = Effect.gen(function* () {
				const logger = yield* Exercise.LoggerService
				yield* logger.log("test message")
			})
			await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(messages).toEqual(["test message"])
		})
	})

	describe("UserRepository", () => {
		it("should support getUser", async () => {
			const testLayer = Layer.succeed(Exercise.UserRepository, {
				getUser: (id: number) => Effect.succeed(`User ${id}`),
				getAllUsers: Effect.succeed(["Alice", "Bob"]),
			})
			const program = Effect.gen(function* () {
				const repo = yield* Exercise.UserRepository
				return yield* repo.getUser(1)
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(testLayer)),
			)
			expect(result).toBe("User 1")
		})

		it("should support getAllUsers", async () => {
			const testLayer = Layer.succeed(Exercise.UserRepository, {
				getUser: (id: number) => Effect.succeed(`User ${id}`),
				getAllUsers: Effect.succeed(["Alice", "Bob"]),
			})
			const program = Effect.gen(function* () {
				const repo = yield* Exercise.UserRepository
				return yield* repo.getAllUsers
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(testLayer)),
			)
			expect(result).toEqual(["Alice", "Bob"])
		})
	})

	describe("randomServiceLive", () => {
		it("should provide a RandomService implementation", async () => {
			const program = Effect.gen(function* () {
				const random = yield* Exercise.RandomService
				return yield* random.next
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(Exercise.randomServiceLive)),
			)
			expect(typeof result).toBe("number")
			expect(result).toBeGreaterThanOrEqual(0)
			expect(result).toBeLessThan(1)
		})
	})

	describe("programUsingRandom", () => {
		it("should return a number from RandomService", async () => {
			const testLayer = Layer.succeed(Exercise.RandomService, {
				next: Effect.succeed(0.5),
			})
			const result = await Effect.runPromise(
				Exercise.programUsingRandom.pipe(Effect.provide(testLayer)),
			)
			expect(result).toBe(0.5)
		})
	})
})
