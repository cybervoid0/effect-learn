import { describe, it, expect } from "vitest"
import { Effect, Either, HashMap, Layer, Option, Ref } from "effect"
import {
	type User,
	UserNotFound,
	Logger,
	UserRepo,
	loggedFind,
	findOrCreate,
	renameUser,
	batchLookup,
} from "./exercise"

// Helper: create test layers with observable state
const makeTestEnv = Effect.gen(function* () {
	const log = yield* Ref.make<ReadonlyArray<string>>([])
	const users = yield* Ref.make(HashMap.empty<string, User>())

	const loggerLayer = Layer.succeed(Logger, {
		info: (msg: string) => Ref.update(log, (arr) => [...arr, msg]),
		error: (msg: string) =>
			Ref.update(log, (arr) => [...arr, `ERROR: ${msg}`]),
	})

	const userRepoLayer = Layer.succeed(UserRepo, {
		findById: (id: string) =>
			Ref.get(users).pipe(
				Effect.andThen(HashMap.get(id)),
				Effect.mapError(() => new UserNotFound({ id })),
			),
		save: (user: User) =>
			Ref.update(users, HashMap.set(user.id, user)),
	})

	const layer = Layer.merge(loggerLayer, userRepoLayer)

	return { log, users, layer } as const
})

// Seed users into the test store
const seedUsers = (
	users: Ref.Ref<HashMap.HashMap<string, User>>,
	entries: ReadonlyArray<User>,
) =>
	Ref.update(users, (map) =>
		entries.reduce((m, u) => HashMap.set(m, u.id, u), map),
	)

describe("06-services / 02-using-services", () => {
	describe("Service definitions", () => {
		it("Logger should have info and error methods", async () => {
			const program = Effect.gen(function* () {
				const { layer } = yield* makeTestEnv
				return yield* Effect.gen(function* () {
					const logger = yield* Logger
					expect(typeof logger.info).toBe("function")
					expect(typeof logger.error).toBe("function")
				}).pipe(Effect.provide(layer))
			})
			await Effect.runPromise(program)
		})

		it("UserRepo should have findById and save methods", async () => {
			const program = Effect.gen(function* () {
				const { layer } = yield* makeTestEnv
				return yield* Effect.gen(function* () {
					const repo = yield* UserRepo
					expect(typeof repo.findById).toBe("function")
					expect(typeof repo.save).toBe("function")
				}).pipe(Effect.provide(layer))
			})
			await Effect.runPromise(program)
		})
	})

	describe("Exercise 1: loggedFind", () => {
		it("should log before finding and return user", async () => {
			const program = Effect.gen(function* () {
				const { log, users, layer } = yield* makeTestEnv
				yield* seedUsers(users, [{ id: "1", name: "Alice" }])

				const result = yield* loggedFind("1").pipe(
					Effect.provide(layer),
				)

				const entries = yield* Ref.get(log)
				expect(entries).toEqual(["looking up: 1"])
				expect(result).toEqual({ id: "1", name: "Alice" })
			})
			await Effect.runPromise(program)
		})

		it("should fail with UserNotFound for missing user", async () => {
			const program = Effect.gen(function* () {
				const { layer } = yield* makeTestEnv
				return yield* loggedFind("999").pipe(
					Effect.provide(layer),
					Effect.either,
				)
			})

			const result = await Effect.runPromise(program)
			expect(Either.isLeft(result)).toBe(true)
			if (Either.isLeft(result)) {
				expect(result.left._tag).toBe("UserNotFound")
				expect(result.left.id).toBe("999")
			}
		})
	})

	describe("Exercise 2: findOrCreate", () => {
		it("should return existing user without creating", async () => {
			const program = Effect.gen(function* () {
				const { log, users, layer } = yield* makeTestEnv
				yield* seedUsers(users, [{ id: "1", name: "Alice" }])

				const result = yield* findOrCreate("1", "Bob").pipe(
					Effect.provide(layer),
				)

				const entries = yield* Ref.get(log)
				expect(result).toEqual({ id: "1", name: "Alice" })
				// Should NOT log "created" for existing user
				expect(entries).not.toContain("created: 1")
			})
			await Effect.runPromise(program)
		})

		it("should create, save, and log for missing user", async () => {
			const program = Effect.gen(function* () {
				const { log, users, layer } = yield* makeTestEnv

				const result = yield* findOrCreate("42", "NewUser").pipe(
					Effect.provide(layer),
				)

				const entries = yield* Ref.get(log)
				const storedUsers = yield* Ref.get(users)

				expect(result).toEqual({ id: "42", name: "NewUser" })
				expect(entries).toContain("created: 42")
				const stored = HashMap.get(storedUsers, "42")
				expect(Option.isSome(stored)).toBe(true)
				if (Option.isSome(stored)) {
					expect(stored.value).toEqual({
						id: "42",
						name: "NewUser",
					})
				}
			})
			await Effect.runPromise(program)
		})
	})

	describe("Exercise 3: renameUser", () => {
		it("should rename existing user and log", async () => {
			const program = Effect.gen(function* () {
				const { log, users, layer } = yield* makeTestEnv
				yield* seedUsers(users, [{ id: "1", name: "Alice" }])

				const result = yield* renameUser("1", "Alicia").pipe(
					Effect.provide(layer),
				)

				const entries = yield* Ref.get(log)
				const storedUsers = yield* Ref.get(users)

				expect(result).toEqual({ id: "1", name: "Alicia" })
				expect(entries).toContain("renamed: 1")
				const stored = HashMap.get(storedUsers, "1")
				expect(Option.isSome(stored)).toBe(true)
				if (Option.isSome(stored)) {
					expect(stored.value).toEqual({
						id: "1",
						name: "Alicia",
					})
				}
			})
			await Effect.runPromise(program)
		})

		it("should fail for nonexistent user", async () => {
			const program = Effect.gen(function* () {
				const { layer } = yield* makeTestEnv
				return yield* renameUser("999", "Ghost").pipe(
					Effect.provide(layer),
					Effect.either,
				)
			})

			const result = await Effect.runPromise(program)
			expect(Either.isLeft(result)).toBe(true)
		})
	})

	describe("Exercise 4: batchLookup", () => {
		it("should log batch count and return Eithers", async () => {
			const program = Effect.gen(function* () {
				const { log, users, layer } = yield* makeTestEnv
				yield* seedUsers(users, [
					{ id: "1", name: "Alice" },
					{ id: "3", name: "Charlie" },
				])

				const results = yield* batchLookup([
					"1",
					"2",
					"3",
				]).pipe(Effect.provide(layer))

				const entries = yield* Ref.get(log)

				expect(entries).toContain("batch: 3 ids")
				expect(results).toHaveLength(3)

				// id "1" — found
				expect(Either.isRight(results[0])).toBe(true)
				if (Either.isRight(results[0])) {
					expect(results[0].right.name).toBe("Alice")
				}

				// id "2" — not found
				expect(Either.isLeft(results[1])).toBe(true)
				if (Either.isLeft(results[1])) {
					expect(results[1].left._tag).toBe("UserNotFound")
				}

				// id "3" — found
				expect(Either.isRight(results[2])).toBe(true)
				if (Either.isRight(results[2])) {
					expect(results[2].right.name).toBe("Charlie")
				}
			})
			await Effect.runPromise(program)
		})

		it("should return empty array for empty input", async () => {
			const program = Effect.gen(function* () {
				const { layer } = yield* makeTestEnv
				return yield* batchLookup([]).pipe(
					Effect.provide(layer),
				)
			})

			const results = await Effect.runPromise(program)
			expect(results).toEqual([])
		})
	})
})
