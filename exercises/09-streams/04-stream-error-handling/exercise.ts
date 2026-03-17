import { Chunk, Effect, Either, pipe, Ref, Schedule, Stream } from "effect"

/**
 * TODO: Create a stream that fails with "error", then use
 * Stream.catchAll to recover and emit "recovered".
 * Collect and return as a readonly array.
 * Expected: ["recovered"]
 */
export const streamCatchAll = (): Effect.Effect<readonly string[]> =>
	pipe(
		Stream.fail("error"),
		Stream.catchAll(() => Stream.make("recovered")),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: Create a stream that fails with "err", then use
 * Stream.orElse to fall back to a stream emitting "fallback".
 * Collect and return as a readonly array.
 * Expected: ["fallback"]
 */
export const streamOrElse = (): Effect.Effect<readonly string[]> =>
	pipe(
		Stream.fail("error"),
		Stream.orElse(() => Stream.make("fallback")),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: Use a Ref to track the number of attempts.
 * Create a stream (via Stream.fromEffect) that:
 * - Reads and increments the Ref
 * - Fails on the first attempt (when count was 0)
 * - Succeeds with "success" on the second attempt
 * Apply Stream.retry(Schedule.once) so it retries once.
 * Collect and return as a readonly array.
 * Expected: ["success"]
 */
export const streamWithRetry = (): Effect.Effect<readonly string[]> =>
	pipe(
		Ref.make<number>(0),
		Effect.andThen(ref =>
			pipe(
				Stream.fromEffect(
					Ref.getAndUpdate(ref, n => n + 1).pipe(
						Effect.andThen(n =>
							n === 0
								? Effect.fail("retry" as const)
								: Effect.succeed("success"),
						),
					),
				),
				Stream.retry(Schedule.once),
				Stream.orDie,
				Stream.runCollect,
				Effect.andThen(Chunk.toReadonlyArray),
			),
		),
	)

/**
 * TODO: Create a stream that emits 1, 2, then fails with "oops".
 * Use Stream.catchAll to recover by emitting 0.
 * Collect and return as a readonly array.
 * Expected: [1, 2, 0]
 */
export const partialStream = (): Effect.Effect<readonly number[]> => {
	// Your code here
	return pipe(
		Stream.make(1, 2),
		Stream.concat(Stream.fail("oops" as const)),
		Stream.catchAll(() => Stream.make(0)),
		Stream.runCollect,
		Effect.andThen(Chunk.toReadonlyArray),
	)
}

/**
 * TODO: Create a stream of [2, 3, 4] and use Stream.mapEffect to:
 * - Succeed with the number if it is even
 * - Fail with "odd" if it is odd
 * Wrap with Stream.either to capture errors as Either values.
 * Map each Either to a string: "right:<number>" or "left:<error>".
 * Collect and return as a readonly array.
 * Expected: ["right:2", "left:odd", "right:4"]
 */
export const streamEither = (): Effect.Effect<readonly string[]> =>
	pipe(
		Stream.fromIterable([2, 3, 4]),
		Stream.mapEffect(n =>
			(n % 2 === 0 ? Effect.succeed(n) : Effect.fail("odd")).pipe(
				Effect.either,
			),
		),
		Stream.map(
			Either.match({
				onLeft: err => `left:${err}`,
				onRight: n => `right:${n}`,
			}),
		),
		Stream.runCollect,
		Effect.andThen(Chunk.toReadonlyArray),
	)
