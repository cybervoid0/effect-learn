import { describe, expect, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import * as Exercise from "./exercise"

describe("03-layers", () => {
	describe("configLayer", () => {
		it("should provide ConfigService with correct values", async () => {
			const program = Effect.gen(function* () {
				const config = yield* Exercise.ConfigService
				return config
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(Exercise.configLayer)),
			)
			expect(result.host).toBe("localhost")
			expect(result.port).toBe(3000)
		})
	})

	describe("dbLayer", () => {
		it("should create a DbService using ConfigService", async () => {
			const program = Effect.gen(function* () {
				const db = yield* Exercise.DbService
				return yield* db.query("SELECT 1")
			})
			const layer = Exercise.dbLayer.pipe(
				Layer.provide(Exercise.configLayer),
			)
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(layer)),
			)
			expect(result).toBe("localhost:3000 > SELECT 1")
		})
	})

	describe("mergedLayer", () => {
		it("should provide both ConfigService and LoggerService", async () => {
			const program = Effect.gen(function* () {
				const config = yield* Exercise.ConfigService
				const logger = yield* Exercise.LoggerService
				yield* logger.log("test")
				return config.host
			})
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(Exercise.mergedLayer)),
			)
			expect(result).toBe("localhost")
		})
	})

	describe("providedProgram", () => {
		it("should return 'localhost:3000'", async () => {
			const result = await Effect.runPromise(Exercise.providedProgram)
			expect(result).toBe("localhost:3000")
		})
	})

	describe("fullStack", () => {
		it("should query through the full layer stack", async () => {
			const result = await Effect.runPromise(Exercise.fullStack)
			expect(result).toBe("localhost:3000 > SELECT 1")
		})
	})
})
