import { Chunk, Effect, pipe, Stream } from "effect"

/**
 * TODO: Concatenate a stream of [1, 2] with a stream of [3, 4]
 * using Stream.concat. Collect and return as a readonly array.
 * Expected: [1, 2, 3, 4]
 */
export const concatStreams = (): Effect.Effect<readonly number[]> =>
	pipe(
		Stream.fromIterable([1, 2]),
		Stream.concat(Stream.fromIterable([3, 4])),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: Merge Stream.make(1, 2, 3) with Stream.make(4, 5, 6)
 * using Stream.merge. Collect and return as a readonly array.
 * Note: order may vary since merge is concurrent.
 */
export const mergeStreams = (): Effect.Effect<readonly number[]> =>
	pipe(
		Stream.make(1, 2, 3),
		Stream.merge(Stream.make(4, 5, 6)),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: Zip Stream.make("a", "b", "c") with Stream.make(1, 2, 3)
 * using Stream.zip. Collect and return as a readonly array of tuples.
 * Expected: [["a", 1], ["b", 2], ["c", 3]]
 */
export const zipStreams = (): Effect.Effect<
	readonly (readonly [string, number])[]
> =>
	pipe(
		Stream.make("a", "b", "c"),
		Stream.zip(Stream.make(1, 2, 3)),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: FlatMap Stream.make(1, 2, 3) so each n produces
 * Stream.make(n, n * 10). Collect and return as a readonly array.
 * Expected: [1, 10, 2, 20, 3, 30]
 */
export const flatMapStream = (): Effect.Effect<readonly number[]> =>
	pipe(
		Stream.make(1, 2, 3),
		Stream.flatMap(n => Stream.make(n, n * 10)),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)

/**
 * TODO: Use Stream.zipWith on Stream.make(1, 2, 3) and
 * Stream.make(10, 20, 30) to add each pair together.
 * Collect and return as a readonly array.
 * Expected: [11, 22, 33]
 */
export const zipWithStream = (): Effect.Effect<readonly number[]> =>
	pipe(
		Stream.make(1, 2, 3),
		Stream.zipWith(Stream.make(10, 20, 30), (l, r) => l + r),
		Stream.runCollect,
		Effect.map(Chunk.toReadonlyArray),
	)
