import { Chunk, Effect, Stream } from "effect"

/**
 * TODO: Create a stream emitting 1, 2, 3 using Stream.make,
 * run it with Stream.runCollect, and convert to a readonly array
 * using Chunk.toReadonlyArray.
 */
export const createSimpleStream = (): Effect.Effect<readonly number[]> =>
	Stream.runCollect(Stream.make(1, 2, 3)).pipe(
		Effect.andThen(Chunk.toReadonlyArray),
	)

/**
 * TODO: Create a stream from the given array using Stream.fromIterable,
 * run it with Stream.runCollect, and return as a readonly array.
 */
export const streamFromArray = (
	items: readonly string[],
): Effect.Effect<readonly string[]> => {
	// Your code here
	return Effect.gen(function* () {
		const stream = Stream.fromIterable(items)
		return yield* Stream.runCollect(stream).pipe(
			Effect.andThen(Chunk.toReadonlyArray),
		)
	})
}

/**
 * TODO: Create a stream of integers from 1 to 10 (inclusive) using
 * Stream.range, run it, and return as a readonly array.
 */
export const rangeStream = (): Effect.Effect<readonly number[]> =>
	Stream.runCollect(Stream.range(1, 10)).pipe(
		Effect.andThen(Chunk.toReadonlyArray),
	)

/**
 * TODO: Create an empty stream using Stream.empty, run it, and
 * return as a readonly array.
 */
export const emptyStream = (): Effect.Effect<readonly never[]> =>
	Stream.runCollect(Stream.empty).pipe(Effect.andThen(Chunk.toReadonlyArray))

/**
 * TODO: Create a single-element stream from Effect.succeed(42) using
 * Stream.fromEffect, run it, and return as a readonly array.
 */
export const streamFromEffect = (): Effect.Effect<readonly number[]> =>
	Stream.runCollect(Stream.fromEffect(Effect.succeed(42))).pipe(
		Effect.andThen(Chunk.toReadonlyArray),
	)
