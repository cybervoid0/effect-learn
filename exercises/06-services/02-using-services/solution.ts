import { Context, Effect } from "effect"

export class RandomService extends Context.Tag("RandomService")<
	RandomService,
	{ readonly next: Effect.Effect<number> }
>() {}

export class LoggerService extends Context.Tag("LoggerService")<
	LoggerService,
	{ readonly log: (message: string) => Effect.Effect<void> }
>() {}

export class UserRepository extends Context.Tag("UserRepository")<
	UserRepository,
	{
		readonly getUser: (id: number) => Effect.Effect<string, Error>
	}
>() {}

/**
 * Use RandomService to get a random number
 */
export const getRandomValue: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.gen(function* () {
	const random = yield* RandomService
	return yield* random.next
})

/**
 * Log "hello" using LoggerService, then return "done"
 */
export const logAndReturn: Effect.Effect<
	string,
	never,
	LoggerService
> = Effect.gen(function* () {
	const logger = yield* LoggerService
	yield* logger.log("hello")
	return "done"
})

/**
 * Get user by id, return "Unknown" on error
 */
export const getUserOrFallback = (
	id: number,
): Effect.Effect<string, never, UserRepository> => {
	return Effect.gen(function* () {
		const repo = yield* UserRepository
		return yield* repo.getUser(id).pipe(
			Effect.catchAll(() => Effect.succeed("Unknown")),
		)
	})
}

/**
 * Use RandomService + LoggerService together
 */
export const multiServiceProgram: Effect.Effect<
	number,
	never,
	RandomService | LoggerService
> = Effect.gen(function* () {
	const random = yield* RandomService
	const logger = yield* LoggerService
	const value = yield* random.next
	yield* logger.log(String(value))
	return value
})

/**
 * Get random value, multiply by 100, round to integer
 */
export const serviceWithMapping: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.gen(function* () {
	const random = yield* RandomService
	const value = yield* random.next
	return Math.round(value * 100)
})
