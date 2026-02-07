import { Console, Effect as E, Schedule, Schema } from "effect"
import * as Cause from "effect/Cause"

/**
 * Production-ready fetch with full error handling
 * vs naive fetch approach
 */

const TodoSchema = Schema.Struct({
	userId: Schema.Number,
	id: Schema.Number,
	title: Schema.String,
	completed: Schema.Boolean,
})

type Todo = typeof TodoSchema.Type

// ❌ NAIVE APPROACH - What most developers do
async function naiveFetch(url: string): Promise<Todo> {
	const response = await fetch(url)
	const data = await response.json()
	return data
}

// Problems with naive approach:
// 1. No timeout - can hang forever
// 2. No retry - fails on temporary network issues
// 3. No validation - accepts any JSON shape
// 4. No error handling - throws untyped errors
// 5. No fallback - crashes the app
// 6. No logging - hard to debug
// 7. No cancellation - wastes resources

// ✅ ROBUST APPROACH - Production-ready with Effect
const robustFetch = (url: string): E.Effect<Todo, string> => {
	return E.gen(function* () {
		// Step 1: Fetch with timeout and network error handling
		const response = yield* E.tryPromise({
			try: () => fetch(url),
			catch: (error) => {
				if (error instanceof TypeError) {
					return "Network error: Unable to connect"
				}
				return `Fetch failed: ${error}`
			},
		}).pipe(
			E.timeout("5 seconds"),
			E.catchTag("TimeoutException", () =>
				E.fail("Request timeout after 5 seconds"),
			),
		)

		// Step 2: Check HTTP status
		if (!response.ok) {
			return yield* E.fail(
				`HTTP ${response.status}: ${response.statusText}`,
			)
		}

		// Step 3: Parse response text
		const text = yield* E.tryPromise({
			try: () => response.text(),
			catch: () => "Failed to read response body",
		})

		// Step 4: Validate JSON structure
		const todo = yield* Schema.decodeUnknown(Schema.parseJson(TodoSchema))(
			text,
		).pipe(
			E.mapError((error) => `Invalid response format: ${error.message}`),
		)

		return todo
	})
}

// Add retry logic with exponential backoff
const robustFetchWithRetry = (url: string): E.Effect<Todo, string> => {
	return robustFetch(url).pipe(
		// Retry up to 3 times with exponential backoff
		E.retry(
			Schedule.exponential("100 millis").pipe(
				Schedule.compose(Schedule.recurs(3)),
			),
		),
		E.tap(() => Console.log("✅ Successfully fetched data")),
		E.tapError((error) => Console.log(`❌ Failed after retries: ${error}`)),
	)
}

// Add fallback for maximum resilience
const robustFetchWithFallback = (
	url: string,
	fallbackData: Todo,
): E.Effect<Todo, never> => {
	return robustFetchWithRetry(url).pipe(
		E.catchAll((error) => {
			return Console.log(`⚠️  Using fallback data: ${error}`).pipe(
				E.andThen(E.succeed(fallbackData)),
			)
		}),
	)
}

// Complete production-ready fetch with all features
const productionFetch = (url: string): E.Effect<Todo, string> => {
	return robustFetch(url).pipe(
		// 1. Retry with exponential backoff
		E.retry(
			Schedule.exponential("100 millis").pipe(
				Schedule.compose(Schedule.recurs(3)),
				Schedule.whileInput((error: string) =>
					// Only retry on network errors, not validation errors
					!error.includes("Invalid response format"),
				),
			),
		),

		// 2. Timeout for the entire operation (including retries)
		E.timeout("10 seconds"),
		E.catchTag("TimeoutException", () =>
			E.fail("Operation timeout after 10 seconds"),
		),

		// 3. Logging
		E.tap((todo) => Console.log("✅ Success:", todo)),
		E.tapError((error) => Console.log("❌ Error:", error)),

		// 4. Error recovery (optional)
		// E.catchAll(() => E.succeed(fallbackData))
	)
}

// ============================================
// DEMONSTRATION
// ============================================

console.log("=".repeat(60))
console.log("COMPARING NAIVE vs ROBUST FETCH")
console.log("=".repeat(60))

// Test 1: Valid URL
console.log("\n📍 Test 1: Valid URL")
const test1 = productionFetch("https://jsonplaceholder.typicode.com/todos/1")

// Test 2: Invalid URL (404)
console.log("\n📍 Test 2: Invalid URL (404)")
const test2 = productionFetch("https://jsonplaceholder.typicode.com/todos/999999")

// Test 3: Invalid domain (network error)
console.log("\n📍 Test 3: Invalid domain (network error)")
const test3 = productionFetch("https://invalid-domain-that-does-not-exist.com/api")

// Test 4: With fallback
console.log("\n📍 Test 4: With fallback data")
const fallbackTodo: Todo = {
	userId: 0,
	id: 0,
	title: "Fallback todo",
	completed: false,
}
const test4 = robustFetchWithFallback(
	"https://invalid-domain.com/api",
	fallbackTodo,
)

// Run all tests
const runTests = E.gen(function* () {
	console.log("\n" + "=".repeat(60))
	console.log("RUNNING TESTS")
	console.log("=".repeat(60))

	// Test 1
	yield* test1.pipe(
		E.catchAll((error) => Console.log(`Test 1 failed: ${error}`)),
	)

	// Test 2
	yield* test2.pipe(
		E.catchAll((error) => Console.log(`Test 2 failed: ${error}`)),
	)

	// Test 3 (will take time due to retries)
	yield* test3.pipe(
		E.catchAll((error) => Console.log(`Test 3 failed: ${error}`)),
	)

	// Test 4 (should succeed with fallback)
	yield* test4

	console.log("\n" + "=".repeat(60))
	console.log("ALL TESTS COMPLETED")
	console.log("=".repeat(60))
})

// Run the demonstration
E.runPromise(runTests)
