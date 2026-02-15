import { Context, Data, Effect, Either } from "effect"

// ============================================================
// Define types and services
// ============================================================

// TODO: Define User type (id: string, name: string)

// TODO: Define UserNotFound tagged error with an `id` field

// TODO: Define Logger service tag ("Logger") with:
//   info:  (msg: string) => Effect.Effect<void>
//   error: (msg: string) => Effect.Effect<void>

// TODO: Define UserRepo service tag ("UserRepo") with:
//   findById: (id: string) => Effect.Effect<User, UserNotFound>
//   save:     (user: User) => Effect.Effect<void>

// Placeholder exports — replace with real definitions
export type User = { readonly id: string; readonly name: string }

export class UserNotFound extends Data.TaggedError("UserNotFound")<{
	readonly id: string
}> {}

export class Logger extends Context.Tag("Logger")<
	Logger,
	Record<string, never> // <-- Replace with real interface
>() {}

export class UserRepo extends Context.Tag("UserRepo")<
	UserRepo,
	Record<string, never> // <-- Replace with real interface
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
	return Effect.succeed({ id: "", name: "" }) as never
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
	return Effect.succeed({ id: "", name: "" }) as never
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
	return Effect.succeed({ id: "", name: "" }) as never
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
	return Effect.succeed([]) as never
}
