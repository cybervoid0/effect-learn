import { Context, Effect } from "effect"

// -- Service definitions (provided for you) --

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

// -- Exercises --

/**
 * TODO: Use RandomService to get a random number and return it.
 */
export const getRandomValue: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Use LoggerService to log "hello", then return the string "done".
 */
export const logAndReturn: Effect.Effect<
	string,
	never,
	LoggerService
> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Use UserRepository.getUser(id) and catch any error
 * to return "Unknown" instead.
 */
export const getUserOrFallback = (
	id: number,
): Effect.Effect<string, never, UserRepository> => {
	return Effect.succeed("") // Replace with correct implementation
}

/**
 * TODO: Use both RandomService and LoggerService:
 * 1. Get a random value
 * 2. Log it as a string
 * 3. Return the value
 */
export const multiServiceProgram: Effect.Effect<
	number,
	never,
	RandomService | LoggerService
> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Get a random value, multiply by 100, round to integer.
 */
export const serviceWithMapping: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.succeed(0) // Replace with correct implementation
