import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import * as Exercise from "./exercise"

const testRandomLayer = Layer.succeed(Exercise.RandomService, {
	next: Effect.succeed(0.5),
})

const testLoggerLayer = (() => {
	const messages: string[] = []
	return {
		messages,
		layer: Layer.succeed(Exercise.LoggerService, {
			log: (message: string) =>
				Effect.sync(() => {
					messages.push(message)
				}),
		}),
	}
})()

const testUserRepoLayer = Layer.succeed(Exercise.UserRepository, {
	getUser: (id: number) =>
		id > 0
			? Effect.succeed(`User ${id}`)
			: Effect.fail(new Error("Not found")),
})

describe("02-using-services", () => {
	describe("getRandomValue", () => {
		it("should return a number from RandomService", async () => {
			const result = await Effect.runPromise(
				Exercise.getRandomValue.pipe(Effect.provide(testRandomLayer)),
			)
			expect(result).toBe(0.5)
		})
	})

	describe("logAndReturn", () => {
		it("should return 'done' after logging", async () => {
			const result = await Effect.runPromise(
				Exercise.logAndReturn.pipe(
					Effect.provide(testLoggerLayer.layer),
				),
			)
			expect(result).toBe("done")
		})
	})

	describe("getUserOrFallback", () => {
		it("should return user name for valid id", async () => {
			const result = await Effect.runPromise(
				Exercise.getUserOrFallback(1).pipe(
					Effect.provide(testUserRepoLayer),
				),
			)
			expect(result).toBe("User 1")
		})

		it("should return 'Unknown' for invalid id", async () => {
			const result = await Effect.runPromise(
				Exercise.getUserOrFallback(-1).pipe(
					Effect.provide(testUserRepoLayer),
				),
			)
			expect(result).toBe("Unknown")
		})
	})

	describe("multiServiceProgram", () => {
		it("should return the random value", async () => {
			const result = await Effect.runPromise(
				Exercise.multiServiceProgram.pipe(
					Effect.provide(
						Layer.merge(testRandomLayer, testLoggerLayer.layer),
					),
				),
			)
			expect(result).toBe(0.5)
		})
	})

	describe("serviceWithMapping", () => {
		it("should return random * 100 rounded", async () => {
			const result = await Effect.runPromise(
				Exercise.serviceWithMapping.pipe(
					Effect.provide(testRandomLayer),
				),
			)
			expect(result).toBe(50)
		})
	})
})
