import { describe, it, expect } from "vitest"
import { Effect, Layer } from "effect"
import {
	AppConfig,
	Database,
	UserService,
	configLayer,
	databaseLayer,
	userServiceLayer,
	resolvedDatabaseLayer,
	fullAppLayer,
} from "./exercise"

describe("06-services / 03-layers", () => {
	describe("Service definitions", () => {
		it("AppConfig should have dbUrl and maxRetries", async () => {
			const program = Effect.gen(function* () {
				const config = yield* AppConfig
				expect(typeof config.dbUrl).toBe("string")
				expect(typeof config.maxRetries).toBe("number")
			})
			await Effect.runPromise(
				program.pipe(Effect.provide(configLayer)),
			)
		})

		it("Database should have query method", async () => {
			const program = Effect.gen(function* () {
				const db = yield* Database
				expect(typeof db.query).toBe("function")
			})
			await Effect.runPromise(
				program.pipe(Effect.provide(resolvedDatabaseLayer)),
			)
		})

		it("UserService should have getUser method", async () => {
			const program = Effect.gen(function* () {
				const svc = yield* UserService
				expect(typeof svc.getUser).toBe("function")
			})
			await Effect.runPromise(
				program.pipe(Effect.provide(fullAppLayer)),
			)
		})
	})

	describe("Exercise 1: configLayer", () => {
		it("should provide correct config values", async () => {
			const program = Effect.gen(function* () {
				const config = yield* AppConfig
				return config
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(configLayer)),
			)
			expect(result.dbUrl).toBe("postgres://localhost")
			expect(result.maxRetries).toBe(3)
		})
	})

	describe("Exercise 2: databaseLayer", () => {
		it("should use dbUrl from config in query results", async () => {
			const program = Effect.gen(function* () {
				const db = yield* Database
				return yield* db.query("SELECT 1")
			})

			const result = await Effect.runPromise(
				program.pipe(
					Effect.provide(databaseLayer),
					Effect.provide(configLayer),
				),
			)
			expect(result).toBe("[postgres://localhost] result: SELECT 1")
		})

		it("should work with custom config", async () => {
			const customConfigLayer = Layer.succeed(AppConfig, {
				dbUrl: "mysql://remote",
				maxRetries: 1,
			})

			const program = Effect.gen(function* () {
				const db = yield* Database
				return yield* db.query("SELECT 1")
			})

			const result = await Effect.runPromise(
				program.pipe(
					Effect.provide(databaseLayer),
					Effect.provide(customConfigLayer),
				),
			)
			expect(result).toBe("[mysql://remote] result: SELECT 1")
		})
	})

	describe("Exercise 3: userServiceLayer", () => {
		it("should query database with correct SQL", async () => {
			const program = Effect.gen(function* () {
				const svc = yield* UserService
				return yield* svc.getUser("42")
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(fullAppLayer)),
			)
			expect(result).toBe(
				"[postgres://localhost] result: SELECT * FROM users WHERE id = '42'",
			)
		})
	})

	describe("Exercise 4: resolvedDatabaseLayer", () => {
		it("should provide Database without needing AppConfig", async () => {
			const program = Effect.gen(function* () {
				const db = yield* Database
				return yield* db.query("SELECT version()")
			})

			// resolvedDatabaseLayer has NO requirements
			const result = await Effect.runPromise(
				program.pipe(Effect.provide(resolvedDatabaseLayer)),
			)
			expect(result).toBe(
				"[postgres://localhost] result: SELECT version()",
			)
		})
	})

	describe("Exercise 5: fullAppLayer", () => {
		it("should provide all three services", async () => {
			const program = Effect.gen(function* () {
				const config = yield* AppConfig
				const db = yield* Database
				const userService = yield* UserService
				return {
					hasConfig: typeof config.dbUrl === "string",
					hasDb: typeof db.query === "function",
					hasUserService:
						typeof userService.getUser === "function",
				}
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(fullAppLayer)),
			)
			expect(result).toEqual({
				hasConfig: true,
				hasDb: true,
				hasUserService: true,
			})
		})

		it("should wire the full dependency chain correctly", async () => {
			const program = Effect.gen(function* () {
				const userService = yield* UserService
				return yield* userService.getUser("100")
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(fullAppLayer)),
			)
			expect(result).toBe(
				"[postgres://localhost] result: SELECT * FROM users WHERE id = '100'",
			)
		})

		it("config values should be accessible alongside other services", async () => {
			const program = Effect.gen(function* () {
				const config = yield* AppConfig
				const userService = yield* UserService
				const user = yield* userService.getUser("1")
				return { retries: config.maxRetries, user }
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(fullAppLayer)),
			)
			expect(result.retries).toBe(3)
			expect(result.user).toContain("postgres://localhost")
		})
	})
})
