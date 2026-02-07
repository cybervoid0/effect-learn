import { Data, Effect as E, type Effect, Option, Schema } from "effect"

/**
 * Tagged errors for this exercise
 */
export class NetworkError extends Data.TaggedError("NetworkError")<{
	readonly message: string
}> {}

export class ValidationError extends Data.TaggedError("ValidationError")<{
	readonly field: string
}> {}

/**
 * TODO: Catch any error and return a fallback value
 */
export const recoverFromError = <A>(
	effect: Effect.Effect<A, string>,
	fallback: A,
): Effect.Effect<A, never> => effect.pipe(E.catchAll(() => E.succeed(fallback)))

/**
 * TODO: Catch only NetworkError and return a fallback message
 * Other errors should remain uncaught
 */
export const recoverFromNetworkError = (
	effect: Effect.Effect<string, NetworkError | ValidationError>,
): Effect.Effect<string, ValidationError> =>
	effect.pipe(
		E.catchTag("NetworkError", () => E.succeed("Network error: timeout")),
	)

/**
 * TODO: Use catchSome to handle only errors that start with "retryable:"
 * Return Effect.succeed("retried") for retryable errors
 * Return Option.none() for other errors
 */
export const retryOnRetryableError = (
	effect: Effect.Effect<string, string>,
): Effect.Effect<string, string> => {
	// Your code here
	return effect.pipe(
		E.catchSome((e) => {
			if (e.startsWith("retryable:")) {
				return Option.some(E.succeed("retried"))
			}
			return Option.none()
		}),
	) // Replace with correct implementation
}

/**
 * TODO: Use match to convert Success/Failure to string
 * Success: "Result: {value}"
 * Failure: "Error: {error}"
 */
export const matchResult = (
	effect: Effect.Effect<number, string>,
): Effect.Effect<string, never> => {
	// Your code here
	return effect.pipe(
		E.match({
			onFailure: (e) => `Error: ${e}`,
			onSuccess: (n) => `Result: ${n}`,
		}),
	)
}

/**
 * TODO: Chain operations with error handling
 * 1. Parse the input string to number (fail with "Invalid number" if not a number)
 * 2. Multiply by 2
 * 3. If result > 100, fail with "Too large"
 * 4. Catch "Too large" error and return 100
 * 5. Other errors should remain uncaught
 */
export const chainWithErrorHandling = (
	input: string,
): Effect.Effect<number, string> => {
	const schema = Schema.String.pipe(Schema.parseNumber)
	// Your code here
	return Schema.decodeUnknown(schema)(input).pipe(
		E.mapError(() => "Invalid number"),
		E.map((x) => x * 2),
		E.filterOrFail(
			(x) => x <= 100,
			() => "Too large",
		),
		E.catchIf(
			(err) => err === "Too large",
			() => E.succeed(100),
		),
	)
}
