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

export interface RateLimiterState {
	readonly count: number
	readonly windowStart: number
}

export class RateLimited extends Data.TaggedError("RateLimited")<{
	readonly remainingMs: number
}> {}

export class RateLimiter extends Context.Tag("RateLimiter")<
	RateLimiter,
	{
		readonly attempt: <A>(
			effect: Effect.Effect<A>,
		) => Effect.Effect<A, RateLimited>
		readonly remaining: Effect.Effect<number>
		readonly reset: Effect.Effect<void>
	}
>() {}

export const rateLimiterLive = (
	maxCalls: number,
	windowMs: number,
): Layer.Layer<RateLimiter, never, Scope.Scope> =>
	Layer.scoped(
		RateLimiter,
		Effect.gen(function* () {
			const now = Effect.sync(() => Date.now())

			const state = yield* Effect.andThen(now, (currentTime) =>
				Ref.make<RateLimiterState>({
					count: 0,
					windowStart: currentTime,
				}),
			)

			const maybeResetWindow = Effect.gen(function* () {
				const currentTime = yield* now
				yield* Ref.update(state, (s) =>
					currentTime > s.windowStart + windowMs
						? { count: 0, windowStart: currentTime }
						: s,
				)
			})

			yield* Effect.forkScoped(
				Effect.forever(
					Effect.gen(function* () {
						yield* Ref.set(state, {
							count: 0,
							windowStart: yield* now,
						})
					}).pipe(Effect.delay(windowMs)),
				),
			)

			return {
				attempt: <A>(effect: Effect.Effect<A>) =>
					Effect.gen(function* () {
						yield* maybeResetWindow
						const currentTime = yield* now
						const allowed = yield* Ref.modify(state, (s) => {
							if (s.count < maxCalls) {
								return [
									true as const,
									{ ...s, count: s.count + 1 },
								]
							}
							return [false as const, s]
						})
						if (!allowed) {
							const s = yield* Ref.get(state)
							return yield* Effect.fail(
								new RateLimited({
									remainingMs:
										s.windowStart +
										windowMs -
										currentTime,
								}),
							)
						}
						return yield* effect
					}),

				remaining: Effect.gen(function* () {
					yield* maybeResetWindow
					const s = yield* Ref.get(state)
					return maxCalls - s.count
				}),

				reset: Effect.gen(function* () {
					const currentTime = yield* now
					yield* Ref.set(state, {
						count: 0,
						windowStart: currentTime,
					})
				}),
			}
		}),
	)

// Program 1: Rate-limited forEach
export const rateLimitedForEach = <A>(
	effects: ReadonlyArray<Effect.Effect<A>>,
): Effect.Effect<
	Array<Either.Either<A, RateLimited>>,
	never,
	RateLimiter
> =>
	Effect.gen(function* () {
		const limiter = yield* RateLimiter
		return yield* Effect.forEach(effects, (effect) =>
			Effect.either(limiter.attempt(effect)),
		)
	})

// Program 2: Retry after rate limit
export const retryAfterLimit = <A>(
	effect: Effect.Effect<A>,
): Effect.Effect<A, RateLimited, RateLimiter> =>
	Effect.gen(function* () {
		const limiter = yield* RateLimiter
		return yield* limiter.attempt(effect).pipe(
			Effect.catchTag("RateLimited", (err) =>
				Effect.gen(function* () {
					yield* Effect.sleep(err.remainingMs)
					return yield* limiter.attempt(effect)
				}),
			),
		)
	})
