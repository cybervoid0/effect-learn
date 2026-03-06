import {
	Array as A,
	Context,
	Data,
	Duration,
	Effect as E,
	type Either,
	Layer,
	Ref,
	type Scope,
} from "effect"

// ============================================================
// Types

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

interface RateLimiterApi {
	attempt: <A>(effect: E.Effect<A>) => E.Effect<A, RateLimited>
	remaining: E.Effect<number>
	reset: E.Effect<void>
}

export class RateLimiter extends Context.Tag("RateLimiter")<
	RateLimiter,
	RateLimiterApi
>() {}

// ============================================================
// Layer
// ============================================================

// TODO: Build a layer that:
export const rateLimiterLive = (
	maxCalls: number,
	windowMs: number,
): Layer.Layer<RateLimiter, never, Scope.Scope> =>
	Layer.scoped(RateLimiter)(
		E.gen(function* () {
			// 1. Creates Ref<RateLimiterState> with { count: 0, windowStart: Date.now() }
			const ref = yield* Ref.make<RateLimiterState>({
				count: 0,
				windowStart: Date.now(),
			})
			// 3. Forks a background fiber to reset counter every windowMs
			// 4. Registers finalizer to interrupt the fiber
			yield* E.forkScoped(
				E.forever(
					Ref.set(ref, { count: 0, windowStart: Date.now() }).pipe(
						E.delay(Duration.millis(windowMs)),
					),
				),
			)
			return RateLimiter.of({
				// 2. In `attempt`:
				//    - If current time > windowStart + windowMs → reset window
				//    - If count < maxCalls → increment count, run the effect
				//    - Else → fail with RateLimited({ remainingMs: windowStart + windowMs - now })
				attempt: effect =>
					E.gen(function* () {
						const state = yield* Ref.get(ref)
						if (Date.now() > state.windowStart + windowMs) {
							yield* Ref.set(ref, { count: 0, windowStart: Date.now() })
						}
						const { count, windowStart } = yield* Ref.get(ref)
						if (count < maxCalls) {
							yield* Ref.update(ref, r => ({ ...r, count: r.count + 1 }))
							return yield* effect
						} else {
							return yield* new RateLimited({
								remainingMs: windowStart + windowMs - Date.now(),
							})
						}
					}),
				remaining: Ref.get(ref).pipe(
					E.andThen(({ count }) => maxCalls - count),
				),
				reset: Ref.set(ref, { count: 0, windowStart: Date.now() }),
			})
		}),
	)

// ============================================================
// Program 1: Rate-limited forEach
// ============================================================

// Execute each effect through rateLimiter.attempt.
// Wrap each in Effect.either to collect successes and RateLimited errors.
export const rateLimitedForEach = <A>(
	effects: ReadonlyArray<E.Effect<A>>,
): E.Effect<Array<Either.Either<A, RateLimited>>, never, RateLimiter> => {
	// Your code here
	return E.gen(function* () {
		const rl = yield* RateLimiter
		return yield* E.all(
			A.map(effects, e => E.either(rl.attempt(e))),
			{ concurrency: "unbounded" },
		)
	})
}

// ============================================================
// Program 2: Retry after rate limit
// ============================================================

// 1. Try rateLimiter.attempt(effect)
// 2. If RateLimited, sleep for remainingMs, then attempt once more
// 3. If still RateLimited on second try, fail with it
export const retryAfterLimit = <A>(
	effect: E.Effect<A>,
): E.Effect<A, RateLimited, RateLimiter> => {
	// Your code here
	return E.gen(function* () {
		const rl = yield* RateLimiter
		return yield* rl.attempt(effect).pipe(
			E.catchTag("RateLimited", err =>
				E.gen(function* () {
					yield* E.sleep(err.remainingMs)
					return yield* retryAfterLimit(effect)
				}),
			),
		)
	})
}
