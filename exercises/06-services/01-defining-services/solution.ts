import { Context, Effect, Layer } from "effect"

/**
 * Service tag for random number generation
 */
export class RandomService extends Context.Tag("RandomService")<
	RandomService,
	{ readonly next: Effect.Effect<number> }
>() {}

/**
 * Service tag for logging
 */
export class LoggerService extends Context.Tag("LoggerService")<
	LoggerService,
	{ readonly log: (message: string) => Effect.Effect<void> }
>() {}

/**
 * Service tag for user management
 */
export class UserRepository extends Context.Tag("UserRepository")<
	UserRepository,
	{
		readonly getUser: (id: number) => Effect.Effect<string, Error>
		readonly getAllUsers: Effect.Effect<string[]>
	}
>() {}

/**
 * Live implementation of RandomService
 */
export const randomServiceLive: Layer.Layer<RandomService> = Layer.succeed(
	RandomService,
	{ next: Effect.sync(() => Math.random()) },
)

/**
 * Program that uses RandomService to get a random number
 */
export const programUsingRandom: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.gen(function* () {
	const random = yield* RandomService
	return yield* random.next
})
