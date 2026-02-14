import { Chunk, Effect, Either, Ref, Schedule, Stream } from "effect"

/**
 * Recover from a failed stream with catchAll
 */
export const streamCatchAll = (): Effect.Effect<readonly string[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.fail("error").pipe(
			Stream.catchAll(() => Stream.make("recovered")),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Fall back to another stream with orElse
 */
export const streamOrElse = (): Effect.Effect<readonly string[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.fail("err").pipe(
			Stream.orElse(() => Stream.make("fallback")),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Retry a failing stream using Ref to track attempts
 */
export const streamWithRetry = (): Effect.Effect<readonly string[]> => {
	return Effect.gen(function* () {
		const attempts = yield* Ref.make(0)
		const stream = Stream.fromEffect(
			Ref.getAndUpdate(attempts, (n) => n + 1).pipe(
				Effect.flatMap((n) =>
					n === 0
						? Effect.fail("retry" as const)
						: Effect.succeed("success"),
				),
			),
		)
		const chunk = yield* stream.pipe(
			Stream.retry(Schedule.once),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Partial stream emitting values before failing, then recovering
 */
export const partialStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.make(1, 2).pipe(
			Stream.concat(Stream.fail("oops" as const)),
			Stream.catchAll(() => Stream.make(0)),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Use Stream.either to capture errors as Either values
 */
export const streamEither = (): Effect.Effect<readonly string[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.make(2, 3, 4).pipe(
			Stream.mapEffect((n) =>
				n % 2 === 0
					? Effect.succeed(n)
					: Effect.fail("odd" as const),
			),
			Stream.either,
			Stream.map(
				Either.match({
					onLeft: (e) => `left:${e}`,
					onRight: (n) => `right:${n}`,
				}),
			),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}
