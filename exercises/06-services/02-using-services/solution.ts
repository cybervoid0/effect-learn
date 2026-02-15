import { Context, Data, Effect, type Either } from "effect"

// Types and services

export type User = { readonly id: string; readonly name: string }

export class UserNotFound extends Data.TaggedError("UserNotFound")<{
	readonly id: string
}> {}

export class Logger extends Context.Tag("Logger")<
	Logger,
	{
		readonly info: (msg: string) => Effect.Effect<void>
		readonly error: (msg: string) => Effect.Effect<void>
	}
>() {}

export class UserRepo extends Context.Tag("UserRepo")<
	UserRepo,
	{
		readonly findById: (
			id: string,
		) => Effect.Effect<User, UserNotFound>
		readonly save: (user: User) => Effect.Effect<void>
	}
>() {}

// Exercise 1: Find user with logging
export const loggedFind = (
	id: string,
): Effect.Effect<User, UserNotFound, Logger | UserRepo> =>
	Effect.gen(function* () {
		const logger = yield* Logger
		const userRepo = yield* UserRepo
		yield* logger.info(`looking up: ${id}`)
		return yield* userRepo.findById(id)
	})

// Exercise 2: Find or create user
export const findOrCreate = (
	id: string,
	name: string,
): Effect.Effect<User, never, Logger | UserRepo> =>
	Effect.gen(function* () {
		const logger = yield* Logger
		const userRepo = yield* UserRepo
		return yield* userRepo.findById(id).pipe(
			Effect.catchTag("UserNotFound", () =>
				Effect.gen(function* () {
					const user: User = { id, name }
					yield* userRepo.save(user)
					yield* logger.info(`created: ${id}`)
					return user
				}),
			),
		)
	})

// Exercise 3: Rename a user
export const renameUser = (
	id: string,
	newName: string,
): Effect.Effect<User, UserNotFound, Logger | UserRepo> =>
	Effect.gen(function* () {
		const logger = yield* Logger
		const userRepo = yield* UserRepo
		const existing = yield* userRepo.findById(id)
		const updated: User = { ...existing, name: newName }
		yield* userRepo.save(updated)
		yield* logger.info(`renamed: ${id}`)
		return updated
	})

// Exercise 4: Batch lookup
export const batchLookup = (
	ids: ReadonlyArray<string>,
): Effect.Effect<
	Array<Either.Either<User, UserNotFound>>,
	never,
	Logger | UserRepo
> =>
	Effect.gen(function* () {
		const logger = yield* Logger
		const userRepo = yield* UserRepo
		yield* logger.info(`batch: ${ids.length} ids`)
		return yield* Effect.forEach(ids, (id) =>
			Effect.either(userRepo.findById(id)),
		)
	})
