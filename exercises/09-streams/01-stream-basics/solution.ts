import { Chunk, Effect, Stream } from "effect"

/**
 * Create a stream emitting 1, 2, 3 and collect to array
 */
export const createSimpleStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.runCollect(Stream.make(1, 2, 3))
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Create a stream from an iterable and collect to array
 */
export const streamFromArray = (
	items: readonly string[],
): Effect.Effect<readonly string[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.runCollect(Stream.fromIterable(items))
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Create a range stream from 1 to 10 and collect to array
 */
export const rangeStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.runCollect(Stream.range(1, 10))
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Create an empty stream and collect to array
 */
export const emptyStream = (): Effect.Effect<readonly never[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.runCollect(Stream.empty)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Create a stream from a single effect and collect to array
 */
export const streamFromEffect = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.runCollect(
			Stream.fromEffect(Effect.succeed(42)),
		)
		return Chunk.toReadonlyArray(chunk)
	})
}
