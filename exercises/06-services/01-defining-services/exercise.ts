import { Context, Effect, Layer } from "effect"

/**
 * TODO: Define a service tag for random number generation.
 * The service interface should have:
 *   readonly next: Effect.Effect<number>
 */
export class RandomService extends Context.Tag("RandomService")<
	RandomService,
	{ readonly next: Effect.Effect<number> }
>() {}

/**
 * TODO: Define a service tag for logging.
 * The service interface should have:
 *   readonly log: (message: string) => Effect.Effect<void>
 */
export class LoggerService extends Context.Tag("LoggerService")<
	LoggerService,
	{ readonly log: (message: string) => Effect.Effect<void> }
>() {}

/**
 * TODO: Define a service tag for user management.
 * The service interface should have:
 *   readonly getUser: (id: number) => Effect.Effect<string, Error>
 *   readonly getAllUsers: Effect.Effect<string[]>
 */
export class UserRepository extends Context.Tag("UserRepository")<
	UserRepository,
	{
		readonly getUser: (id: number) => Effect.Effect<string, Error>
		readonly getAllUsers: Effect.Effect<string[]>
	}
>() {}

/**
 * TODO: Create a Layer.succeed for RandomService.
 * The implementation should return Math.random() wrapped in Effect.sync.
 */
export const randomServiceLive: Layer.Layer<RandomService> = Layer.succeed(
	RandomService,
	{ next: Effect.succeed(0) }, // Replace: use Effect.sync(() => Math.random())
)

/**
 * TODO: Write an Effect that uses RandomService to get a random number.
 * Use Effect.gen to yield the service tag and then yield its `next` method.
 */
export const programUsingRandom: Effect.Effect<
	number,
	never,
	RandomService
> = Effect.succeed(0) // Replace with correct implementation
