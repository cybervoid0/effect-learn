import { Data, Effect, Option } from "effect"

export class NetworkError extends Data.TaggedError("NetworkError")<{
	readonly message: string
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
	readonly field: string
}> {}

/**
 * Catch any error and return a fallback value
 */
export const recoverFromError = <A>(
	effect: Effect.Effect<A, string>,
	fallback: A,
): Effect.Effect<A, never> => {
	return effect.pipe(Effect.catchAll(() => Effect.succeed(fallback)))
}

/**
 * Catch only NetworkError
 */
export const recoverFromNetworkError = (
	effect: Effect.Effect<string, NetworkError | ValidationError>,
): Effect.Effect<string, ValidationError> => {
	return effect.pipe(
		Effect.catchTag("NetworkError", (error) =>
			Effect.succeed(`Network error: ${error.message}`),
		),
	)
}

/**
 * Conditionally handle retryable errors
 */
export const retryOnRetryableError = (
	effect: Effect.Effect<string, string>,
): Effect.Effect<string, string> => {
	return effect.pipe(
		Effect.catchSome((error) =>
			error.startsWith("retryable:")
				? Option.some(Effect.succeed("retried"))
				: Option.none(),
		),
	)
}

/**
 * Use match to convert Success/Failure to string
 */
export const matchResult = (
	effect: Effect.Effect<number, string>,
): Effect.Effect<string, never> => {
	return effect.pipe(
		Effect.match({
			onFailure: (error) => `Error: ${error}`,
			onSuccess: (value) => `Result: ${value}`,
		}),
	)
}

/**
 * Chain operations with error handling
 */
export const chainWithErrorHandling = (
	input: string,
): Effect.Effect<number, string> => {
	return Effect.gen(function* () {
		// Parse number
		const num = Number(input)
		if (Number.isNaN(num)) {
			return yield* Effect.fail("Invalid number")
		}

		// Multiply by 2
		const doubled = num * 2

		// Check if too large
		if (doubled > 100) {
			return yield* Effect.fail("Too large")
		}

		return doubled
	}).pipe(
		Effect.catchSome((error) =>
			error === "Too large"
				? Option.some(Effect.succeed(100))
				: Option.none(),
		),
	)
}
