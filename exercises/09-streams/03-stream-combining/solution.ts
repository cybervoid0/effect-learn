import { Chunk, Effect, Stream } from "effect"

/**
 * Concatenate two streams sequentially
 */
export const concatStreams = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.concat(
			Stream.make(1, 2),
			Stream.make(3, 4),
		).pipe(Stream.runCollect)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Merge two streams concurrently
 */
export const mergeStreams = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.merge(
			Stream.make(1, 2, 3),
			Stream.make(4, 5, 6),
		).pipe(Stream.runCollect)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Zip two streams into tuples
 */
export const zipStreams = (): Effect.Effect<
	readonly (readonly [string, number])[]
> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.zip(
			Stream.make("a", "b", "c"),
			Stream.make(1, 2, 3),
		).pipe(Stream.runCollect)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * FlatMap each element into a sub-stream
 */
export const flatMapStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.make(1, 2, 3).pipe(
			Stream.flatMap((n) => Stream.make(n, n * 10)),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * ZipWith to combine pairs by adding
 */
export const zipWithStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.zipWith(
			Stream.make(1, 2, 3),
			Stream.make(10, 20, 30),
			(a, b) => a + b,
		).pipe(Stream.runCollect)
		return Chunk.toReadonlyArray(chunk)
	})
}
