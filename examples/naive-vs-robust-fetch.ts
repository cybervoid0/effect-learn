/**
 * ARTICLE EXAMPLE: Why Naive Fetch is Dangerous
 * 
 * This file demonstrates the difference between naive Promise-based fetch
 * and production-ready Effect-based fetch with comprehensive error handling.
 */

import { Console, Effect, Schedule, Schema } from "effect"
import * as Cause from "effect/Cause"

const TodoSchema = Schema.Struct({
	userId: Schema.Number,
	id: Schema.Number,
	title: Schema.String,
	completed: Schema.Boolean,
})

type Todo = typeof TodoSchema.Type

// ============================================
// ❌ NAIVE APPROACH - What 90% of developers do
// ============================================

async function naiveFetch(url: string): Promise<Todo> {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

/**
 * Problems with naive approach:
 * 
 * 1. ❌ No timeout
 *    - Can hang forever if server doesn't respond
 *    - User waits indefinitely
 * 
 * 2. ❌ No retry logic
 *    - Fails immediately on temporary network issues
 *    - 1 packet loss = complete failure
 * 
 * 3. ❌ No validation
 *    - Accepts any JSON shape
 *    - Runtime errors when accessing properties
 *    - Type safety is a lie (any)
 * 
 * 4. ❌ No HTTP status check
 *    - 404, 500, 503 all return "success"
 *    - Tries to parse error HTML as JSON
 * 
 * 5. ❌ Untyped errors
 *    - Throws random exceptions
 *    - Caller doesn't know what can go wrong
 *    - Can't handle errors properly
 * 
 * 6. ❌ No fallback strategy
 *    - Single point of failure
 *    - Crashes the entire app
 * 
 * 7. ❌ No logging/observability
 *    - Hard to debug in production
 *    - No metrics, no tracing
 * 
 * 8. ❌ No cancellation
 *    - Wastes resources on abandoned requests
 *    - Memory leaks in SPAs
 */

// ============================================
// ✅ ROBUST APPROACH - Production-ready
// ============================================

const robustFetch = (url: string): Effect.Effect<Todo, string> => {
	return Effect.gen(function* () {
		// 1. Fetch with proper error handling
		const response = yield* Effect.tryPromise({
			try: () => fetch(url),
			catch: (error) => {
				// Handle different error types
				if (error instanceof TypeError) {
					return "Network error: Unable to connect"
				}
				if (error instanceof DOMException && error.name === "AbortError") {
					return "Request was aborted"
				}
				return `Fetch failed: ${String(error)}`
			},
		}).pipe(
			// 2. Add timeout
			Effect.timeout("5 seconds"),
			Effect.catchTag("TimeoutException", () =>
				Effect.fail("Request timeout after 5 seconds"),
			),
		)

		// 3. Check HTTP status
		if (!response.ok) {
			return yield* Effect.fail(
				`HTTP ${response.status}: ${response.statusText}`,
			)
		}

		// 4. Parse response body safely
		const text = yield* Effect.tryPromise({
			try: () => response.text(),
			catch: () => "Failed to read response body",
		})

		// 5. Validate JSON structure with Schema
		const todo = yield* Schema.decodeUnknown(Schema.parseJson(TodoSchema))(
			text,
		).pipe(
			Effect.mapError((error) => {
				const message = error.message || String(error)
				return `Invalid response format: ${message}`
			}),
		)

		return todo
	})
}

// ============================================
// 🚀 PRODUCTION-READY with all features
// ============================================

const productionFetch = (
	url: string,
	options?: {
		maxRetries?: number
		timeout?: string
		fallback?: Todo
	},
): Effect.Effect<Todo, string> => {
	const maxRetries = options?.maxRetries ?? 3
	const timeout = options?.timeout ?? "10 seconds"

	return robustFetch(url).pipe(
		// 1. Retry with exponential backoff
		Effect.retry(
			Schedule.exponential("100 millis").pipe(
				Schedule.compose(Schedule.recurs(maxRetries)),
				Schedule.whileInput((error: string) =>
					// Only retry on network errors, not validation/404 errors
					error.includes("Network error") ||
					error.includes("timeout") ||
					error.includes("Fetch failed"),
				),
			),
		),

		// 2. Global timeout (including retries)
		Effect.timeout(timeout),
		Effect.catchTag("TimeoutException", () =>
			Effect.fail(`Operation timeout after ${timeout}`),
		),

		// 3. Observability
		Effect.tap((todo) =>
			Console.log(`✅ Successfully fetched: ${todo.title}`),
		),
		Effect.tapError((error) => Console.log(`❌ Error: ${error}`)),

		// 4. Fallback (optional)
		options?.fallback
			? Effect.catchAll((error) =>
					Console.log(`⚠️  Using fallback data due to: ${error}`).pipe(
						Effect.andThen(Effect.succeed(options.fallback)),
					),
			  )
			: (x: Effect.Effect<Todo, string>) => x,
	)
}

// ============================================
// 📊 COMPARISON TABLE
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                    NAIVE FETCH vs ROBUST FETCH                     ║
╠════════════════════════════════════════════════════════════════════╣
║ Feature              │ Naive Fetch    │ Robust Fetch (Effect)     ║
╠══════════════════════╪════════════════╪═══════════════════════════╣
║ Timeout              │ ❌ None         │ ✅ Configurable           ║
║ Retry                │ ❌ None         │ ✅ Exponential backoff    ║
║ Validation           │ ❌ None (any)   │ ✅ Schema validation      ║
║ HTTP Status Check    │ ❌ None         │ ✅ Full check             ║
║ Error Types          │ ❌ Untyped      │ ✅ Typed (string)         ║
║ Fallback             │ ❌ None         │ ✅ Configurable           ║
║ Logging              │ ❌ None         │ ✅ Built-in               ║
║ Cancellation         │ ❌ Hard         │ ✅ Built-in               ║
║ Composability        │ ❌ Limited      │ ✅ Excellent              ║
║ Testability          │ ❌ Hard         │ ✅ Easy                   ║
║ Type Safety          │ ❌ any types    │ ✅ Full types             ║
║ Error Recovery       │ ❌ try-catch    │ ✅ Functional operators   ║
╚══════════════════════╧════════════════╧═══════════════════════════╝
`)

// ============================================
// 🧪 DEMONSTRATION
// ============================================

const runDemo = Effect.gen(function* () {
	console.log("\n" + "=".repeat(70))
	console.log("TEST 1: Valid URL")
	console.log("=".repeat(70))

	const test1 = yield* productionFetch(
		"https://jsonplaceholder.typicode.com/todos/1",
	).pipe(Effect.either)

	console.log("\n" + "=".repeat(70))
	console.log("TEST 2: 404 Error")
	console.log("=".repeat(70))

	const test2 = yield* productionFetch(
		"https://jsonplaceholder.typicode.com/todos/999999",
	).pipe(Effect.either)

	console.log("\n" + "=".repeat(70))
	console.log("TEST 3: Network Error (with retries)")
	console.log("=".repeat(70))

	const test3 = yield* productionFetch(
		"https://invalid-domain-that-does-not-exist.com/api",
		{ maxRetries: 2 },
	).pipe(Effect.either)

	console.log("\n" + "=".repeat(70))
	console.log("TEST 4: Network Error with Fallback")
	console.log("=".repeat(70))

	const fallbackTodo: Todo = {
		userId: 0,
		id: 0,
		title: "Cached todo (offline mode)",
		completed: false,
	}

	const test4 = yield* productionFetch(
		"https://invalid-domain.com/api",
		{ fallback: fallbackTodo, maxRetries: 1 },
	)

	console.log("\n" + "=".repeat(70))
	console.log("✅ ALL TESTS COMPLETED")
	console.log("=".repeat(70))
	console.log("\nFinal result with fallback:", test4)
})

// Run the demonstration
Effect.runPromise(runDemo).catch(console.error)
