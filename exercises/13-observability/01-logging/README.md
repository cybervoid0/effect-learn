# Structured Logging

## Concept

Effect provides a built-in structured logging system that integrates directly into the Effect runtime. Unlike `console.log`, Effect's logging is composable, testable, and can carry structured metadata such as annotations and spans.

Key logging APIs:
- `Effect.log` / `Effect.logInfo` - informational messages
- `Effect.logDebug` - debug-level messages (hidden by default)
- `Effect.logWarning` - warning messages
- `Effect.logError` - error messages
- `Effect.annotateLogs` - attach key-value metadata to all logs within a scope
- `Effect.withLogSpan` - add timing spans to logs

Because logging is an effect, it composes naturally with the rest of your Effect program.

## Assignment

Implement the following functions in `exercise.ts`:

1. **`logMessage`** - Log an info-level message "Hello, Effect!" and return "done".
2. **`logAtLevels`** - Log one message at each level (debug, info, warning, error) and return "complete".
3. **`annotatedLog`** - Use `Effect.annotateLogs` to attach `requestId: "abc-123"` to a log message "processing", then return "annotated".
4. **`logWithSpan`** - Use `Effect.withLogSpan("myOperation")` to wrap an effect that logs "started" and returns "spanned".
5. **`conditionalLogging`** - Given a number `n`, log at info level if positive, warning if zero, error if negative. Return `n`.

## Examples

```typescript
import { Effect } from "effect"

// Basic logging
const program = Effect.gen(function* () {
	yield* Effect.logInfo("Server started")
	return "ready"
})

// Annotated logging
const annotated = Effect.gen(function* () {
	yield* Effect.logInfo("Request received")
	return "ok"
}).pipe(Effect.annotateLogs("traceId", "xyz-789"))

// Log spans add timing information
const spanned = Effect.gen(function* () {
	yield* Effect.log("working...")
	return "result"
}).pipe(Effect.withLogSpan("database-query"))
```

## Hints

- `Effect.logInfo("msg")` returns `Effect<void>`. You need to sequence it with `Effect.as` or use `Effect.gen` to return a value after logging.
- `Effect.annotateLogs` can wrap an entire effect pipeline, annotating all logs within.
- `Effect.withLogSpan` is a function that takes a span name and returns a function that wraps an effect.
- Use `Effect.gen` to sequence log calls followed by return values.

## Bonus

- Try combining multiple annotations with `Effect.annotateLogs` using a record: `Effect.annotateLogs({ key1: "val1", key2: "val2" })`.
- Experiment with `Logger.minimumLogLevel(LogLevel.Debug)` to make debug logs visible.
