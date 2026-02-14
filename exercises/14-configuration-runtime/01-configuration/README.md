# Configuration

## Concept

Effect provides a typed, composable configuration system through the `Config` module. Instead of reading environment variables directly with `process.env`, you declare your configuration needs as `Config` values that are validated, typed, and can be provided from multiple sources.

Key Config APIs:
- `Config.string("KEY")` - read a string config value
- `Config.number("KEY")` - read and parse a numeric config value
- `Config.boolean("KEY")` - read and parse a boolean config value
- `Config.withDefault(fallback)` - provide a default if the key is missing
- `Config.map(fn)` - transform a config value
- `Config.all({...})` / `Effect.all({...})` - combine multiple configs

Config values are effects that can fail with `ConfigError` when a key is missing or a value cannot be parsed. You provide config values at runtime using `ConfigProvider`.

## Assignment

Implement the following functions in `exercise.ts`:

1. **`readStringConfig`** - Read a string config value for key "APP_NAME".
2. **`readNumberConfig`** - Read a number config value for key "PORT".
3. **`configWithDefault`** - Read string config "LOG_LEVEL" with a default of "info".
4. **`combinedConfig`** - Combine string config "HOST" and number config "PORT" into `{ host, port }`.
5. **`mappedConfig`** - Read number config "PORT" and multiply it by 10 using `Config.map`.

## Examples

```typescript
import { Config, ConfigProvider, Effect, Layer } from "effect"

// Read a string config
const appName = Config.string("APP_NAME")

// With default
const logLevel = Config.string("LOG_LEVEL").pipe(Config.withDefault("info"))

// Combine configs
const dbConfig = Effect.all({
	host: Config.string("DB_HOST"),
	port: Config.number("DB_PORT"),
})

// Provide config values for testing
const provider = ConfigProvider.fromMap(new Map([["APP_NAME", "MyApp"]]))
const layer = Layer.setConfigProvider(provider)
const result = Effect.runSync(appName.pipe(Effect.provide(layer)))
```

## Hints

- `Config.string("KEY")` is itself an `Effect` that can be yielded in `Effect.gen`.
- `Config.withDefault` is piped onto a Config: `Config.string("KEY").pipe(Config.withDefault("fallback"))`.
- `Config.map` transforms the value: `Config.number("PORT").pipe(Config.map(n => n * 10))`.
- In tests, use `ConfigProvider.fromMap` + `Layer.setConfigProvider` to supply values.

## Bonus

- Try `Config.secret("API_KEY")` which returns a `Secret` type that redacts itself in logs.
- Explore `Config.all` for combining many configs at once with a tuple or struct.
