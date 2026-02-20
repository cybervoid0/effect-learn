import { Context, Data, Effect, type Either } from "effect"

// ============================================================
// Define types and services
// ============================================================

// TODO: Define User type (id: string, name: string)
export interface User {
	readonly id: string
	readonly name: string
}

// TODO: Define UserNotFound tagged error with an `id` field
export class UserNotFound extends Data.TaggedError("UserNotFound")<{
	id: string
}> {}

// TODO: Define Logger service tag ("Logger") with:
interface LoggerAPI {
	info: (msg: string) => Effect.Effect<void>
	error: (msg: string) => Effect.Effect<void>
}
export class Logger extends Context.Tag("Logger")<Logger, LoggerAPI>() {}

// TODO: Define UserRepo service tag ("UserRepo") with:
interface UserRepoAPI {
	findById: (id: string) => Effect.Effect<User, UserNotFound>
	save: (user: User) => Effect.Effect<void>
}
export class UserRepo extends Context.Tag("UserRepo")<
	UserRepo,
	UserRepoAPI
>() {}

// ============================================================
// Exercise 1: Find user with logging
// ============================================================

// Look up a user by id. Before the lookup, log "looking up: <id>"
// using logger.info. Return the found user.
export const loggedFind = (
	id: string,
): Effect.Effect<User, UserNotFound, Logger | UserRepo> => {
	// Your code here
	return Effect.gen(function* () {
		const logger = yield* Logger
		yield* logger.info(`looking up: ${id}`)
		const { findById } = yield* UserRepo
		return yield* findById(id)
	})
}

// ============================================================
// Exercise 2: Find or create user
// ============================================================

// Try to find user by id. If UserNotFound:
// 1. Create User { id, name }
// 2. Save the new user via userRepo.save
// 3. Log "created: <id>" via logger.info
// 4. Return the new user
export const findOrCreate = (
	id: string,
	name: string,
): Effect.Effect<User, never, Logger | UserRepo> => {
	// Your code here
	return Effect.gen(function* () {
		const { findById, save } = yield* UserRepo
		const logger = yield* Logger
		return yield* findById(id).pipe(
			Effect.catchTag("UserNotFound", () =>
				Effect.gen(function* () {
					const newUser: User = { id, name }
					yield* save(newUser)
					yield* logger.info(`created: ${id}`)
					return newUser
				}),
			),
		)
	})
}

// ============================================================
// Exercise 3: Rename a user
// ============================================================

// 1. Find user by id
// 2. Create new user object with the updated name
// 3. Save the updated user
// 4. Log "renamed: <id>" via logger.info
// 5. Return the updated user
export const renameUser = (
	id: string,
	newName: string,
): Effect.Effect<User, UserNotFound, Logger | UserRepo> => {
	// Your code here
	return Effect.gen(function* () {
		const { findById, save } = yield* UserRepo
		const user = yield* findById(id)
		const newUser: User = { ...user, name: newName }
		yield* save(newUser)
		const logger = yield* Logger
		yield* logger.info(`renamed: ${user.id}`)
		return newUser
	})
}

// ============================================================
// Exercise 4: Batch lookup with Either results
// ============================================================

// 1. Log "batch: <count> ids" via logger.info (where count = ids.length)
// 2. For each id, look up the user and wrap in Effect.either
// 3. Return Array<Either<User, UserNotFound>>
export const batchLookup = (
	ids: ReadonlyArray<string>,
): Effect.Effect<
	Array<Either.Either<User, UserNotFound>>,
	never,
	Logger | UserRepo
> => {
	// Your code here
	return Effect.gen(function* () {
		const logger = yield* Logger
		yield* logger.info(`batch: ${ids.length} ids`)
		const { findById } = yield* UserRepo
		return yield* Effect.forEach(ids, (id) => Effect.either(findById(id)))
	})
}
