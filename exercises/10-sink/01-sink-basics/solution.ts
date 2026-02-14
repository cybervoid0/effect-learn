import { Chunk, Effect, Ref, Sink, Stream } from "effect"

/**
 * Collect all stream elements into an array
 */
export const collectAll = (): Effect.Effect<number[]> => {
	return Effect.gen(function* () {
		const chunk = yield* Stream.run(
			Stream.make(1, 2, 3, 4, 5),
			Sink.collectAll(),
		)
		return Chunk.toArray(chunk)
	})
}

/**
 * Sum all stream elements
 */
export const sumElements = (): Effect.Effect<number> => {
	return Stream.run(Stream.make(10, 20, 30), Sink.sum)
}

/**
 * Count stream elements
 */
export const countElements = (): Effect.Effect<number> => {
	return Stream.run(Stream.make("a", "b", "c", "d"), Sink.count)
}

/**
 * Fold with early termination when accumulator reaches 10
 */
export const foldElements = (): Effect.Effect<number> => {
	return Stream.run(
		Stream.make(1, 2, 3, 4, 5),
		Sink.fold(0, (acc) => acc < 10, (acc, n) => acc + n),
	)
}

/**
 * Use forEach to append each element to a Ref
 */
export const forEachSink = (): Effect.Effect<number[]> => {
	return Effect.gen(function* () {
		const ref = yield* Ref.make<number[]>([])
		yield* Stream.run(
			Stream.make(1, 2, 3),
			Sink.forEach((n: number) =>
				Ref.update(ref, (arr) => [...arr, n]),
			),
		)
		return yield* Ref.get(ref)
	})
}
