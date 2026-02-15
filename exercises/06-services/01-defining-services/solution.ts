import { Context, Data, Effect, HashMap, Layer, Option, Ref } from "effect"

// Exercise 1: Tagged error with key field
export class KeyNotFoundError extends Data.TaggedError(
	"KeyNotFoundError",
)<{
	readonly key: string
}> {}

// Exercise 2: KeyValueStore service tag
export class KeyValueStore extends Context.Tag("KeyValueStore")<
	KeyValueStore,
	{
		readonly get: (
			key: string,
		) => Effect.Effect<string, KeyNotFoundError>
		readonly set: (
			key: string,
			value: string,
		) => Effect.Effect<void>
		readonly delete: (key: string) => Effect.Effect<void>
	}
>() {}

// Exercise 3: Live layer backed by Ref<HashMap>
export const keyValueStoreLive: Layer.Layer<KeyValueStore> = Layer.effect(
	KeyValueStore,
	Effect.gen(function* () {
		const state = yield* Ref.make(HashMap.empty<string, string>())
		return {
			get: (key: string) =>
				Ref.get(state).pipe(
					Effect.map(HashMap.get(key)),
					Effect.andThen(
						Option.match({
							onNone: () =>
								Effect.fail(new KeyNotFoundError({ key })),
							onSome: Effect.succeed,
						}),
					),
				),
			set: (key: string, value: string) =>
				Ref.update(state, HashMap.set(key, value)),
			delete: (key: string) =>
				Ref.update(state, HashMap.remove(key)),
		}
	}),
)

// Exercise 4: Get or default
export const getOrDefault = (
	key: string,
	defaultValue: string,
): Effect.Effect<string, never, KeyValueStore> =>
	Effect.gen(function* () {
		const store = yield* KeyValueStore
		return yield* store.get(key).pipe(
			Effect.catchTag("KeyNotFoundError", () =>
				Effect.succeed(defaultValue),
			),
		)
	})

// Exercise 5: Set and get
export const setAndGet = (
	key: string,
	value: string,
): Effect.Effect<string, KeyNotFoundError, KeyValueStore> =>
	Effect.gen(function* () {
		const store = yield* KeyValueStore
		yield* store.set(key, value)
		return yield* store.get(key)
	})
