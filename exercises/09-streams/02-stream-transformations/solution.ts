import { Chunk, Effect, Stream } from "effect"

/**
 * Map each element to double its value
 */
export const mapStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.make(1, 2, 3).pipe(
			Stream.map((x) => x * 2),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Filter to keep only even numbers from 1-10
 */
export const filterStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.range(1, 10).pipe(
			Stream.filter((x) => x % 2 === 0),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Take the first 5 elements from 1-100
 */
export const takeFromStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.range(1, 100).pipe(
			Stream.take(5),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Drop the first 7 elements from 1-10
 */
export const dropFromStream = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.range(1, 10).pipe(
			Stream.drop(7),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}

/**
 * Chain: filter even, square, take 3 from 1-20
 */
export const chainTransformations = (): Effect.Effect<readonly number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.range(1, 20).pipe(
			Stream.filter((x) => x % 2 === 0),
			Stream.map((x) => x * x),
			Stream.take(3),
			Stream.runCollect,
		)
		return Chunk.toReadonlyArray(chunk)
	})
}
