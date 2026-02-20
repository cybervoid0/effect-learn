import {
	Context,
	Data,
	Effect,
	type Either,
	Fiber,
	Layer,
	Ref,
	Scope,
} from "effect"

// ============================================================
// Types
// ============================================================

export interface RateLimiterState {
	readonly count: number
	readonly windowStart: number
}

// ============================================================
// Error
// ============================================================

// TODO: Define RateLimited tagged error with `remainingMs: number`
export class RateLimited extends Data.TaggedError("RateLimited")<{
	readonly remainingMs: number
}> {}

// ============================================================
// Service
// ============================================================

// TODO: Define RateLimiter service with:
//   attempt:   <A>(effect: Effect<A>) => Effect<A, RateLimited>
//   remaining: Effect<number>
//   reset:     Effect<void>

export class RateLimiter extends Context.Tag("RateLimiter")<
	RateLimiter,
	Record<string, never> // <-- Replace with real interface
>() {}

// ============================================================
// Layer
// ============================================================

// TODO: Build a layer that:
// 1. Creates Ref<RateLimiterState> with { count: 0, windowStart: Date.now() }
// 2. In `attempt`:
//    - If current time > windowStart + windowMs → reset window
//    - If count < maxCalls → increment count, run the effect
//    - Else → fail with RateLimited({ remainingMs: windowStart + windowMs - now })
// 3. Forks a background fiber to reset counter every windowMs
// 4. Registers finalizer to interrupt the fiber

export const rateLimiterLive = (
	maxCalls: number,
	windowMs: number,
): Layer.Layer<RateLimiter, never, Scope.Scope> =>
	Layer.succeed(RateLimiter, {} as never) // <-- Replace

// ============================================================
// Program 1: Rate-limited forEach
// ============================================================

// Execute each effect through rateLimiter.attempt.
// Wrap each in Effect.either to collect successes and RateLimited errors.
export const rateLimitedForEach = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<
	Array<Either.Either<A, RateLimited>>,
	never,
	RateLimiter
> => {
	// Your code here
	return Effect.succeed([]) as never
}

// ============================================================
// Program 2: Retry after rate limit
// ============================================================

// 1. Try rateLimiter.attempt(effect)
// 2. If RateLimited, sleep for remainingMs, then attempt once more
// 3. If still RateLimited on second try, fail with it
export const retryAfterLimit = <A>(
	effect: Effect.Effect<A>,
): Effect.Effect<A, RateLimited, RateLimiter> => {
	// Your code here
	return Effect.succeed("TODO") as never
}
