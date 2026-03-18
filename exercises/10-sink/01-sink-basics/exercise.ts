import { Chunk, Effect, pipe, Ref, Sink, Stream } from "effect"

/**
 * TODO: Run Stream.make(1, 2, 3, 4, 5) into Sink.collectAll(),
 * then convert the resulting Chunk to an array with Chunk.toArray.
 * Expected: [1, 2, 3, 4, 5]
 */
export const collectAll = (): Effect.Effect<number[]> =>
	pipe(
		Stream.range(1, 5),
		Stream.run(Sink.collectAll()),
		Effect.andThen(Chunk.toArray),
	)

/**
 * TODO: Run Stream.make(10, 20, 30) into Sink.sum.
 * Expected: 60
 */
export const sumElements = (): Effect.Effect<number> =>
	pipe(Stream.make(10, 20, 30), Stream.run(Sink.sum))

/**
 * TODO: Run Stream.make("a", "b", "c", "d") into Sink.count.
 * Expected: 4
 */
export const countElements = (): Effect.Effect<number> =>
	pipe(Stream.make("a", "b", "c", "d"), Stream.run(Sink.count))

/**
 * TODO: Run Stream.make(1, 2, 3, 4, 5) into Sink.fold with:
 * - Initial value: 0
 * - Continue predicate: acc => acc < 10
 * - Step function: (acc, n) => acc + n
 * The fold should stop when the accumulator reaches 10 or more.
 * Expected: 10
 */
export const foldElements = (): Effect.Effect<number> =>
	pipe(
		Stream.make(1, 2, 3, 4, 5),
		Stream.run(
			Sink.fold(
				0,
				acc => acc < 10,
				(acc, n) => acc + n,
			),
		),
	)

/**
 * TODO: Create a Ref<number[]>, run Stream.make(1, 2, 3) into
 * Sink.forEach that appends each element to the Ref.
 * Return the final Ref value.
 * Expected: [1, 2, 3]
 */
export const forEachSink = (): Effect.Effect<number[]> =>
	Effect.gen(function* () {
		const ref = yield* Ref.make<number[]>([])
		yield* Stream.make(1, 2, 3).pipe(
			// biome-ignore lint/suspicious/useIterableCallbackReturn: no, it's OK to return an effect
			Stream.run(Sink.forEach(n => Ref.update(ref, old => [...old, n]))),
		)

		return yield* Ref.get(ref)
	})
