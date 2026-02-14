import { Context, Effect, Layer } from "effect"

// -- Service definitions --

export class ConfigService extends Context.Tag("ConfigService")<
	ConfigService,
	{ readonly host: string; readonly port: number }
>() {}

export class DbService extends Context.Tag("DbService")<
	DbService,
	{ readonly query: (sql: string) => Effect.Effect<string> }
>() {}

export class LoggerService extends Context.Tag("LoggerService")<
	LoggerService,
	{ readonly log: (msg: string) => Effect.Effect<void> }
>() {}

// -- Provided for you --

export const loggerLayer: Layer.Layer<LoggerService> = Layer.succeed(
	LoggerService,
	{ log: () => Effect.void },
)

// -- Exercises --

/**
 * TODO: Create a Layer.succeed for ConfigService.
 * Use host: "localhost" and port: 3000.
 */
export const configLayer: Layer.Layer<ConfigService> = Layer.succeed(
	ConfigService,
	{ host: "", port: 0 }, // Replace with correct values
)

/**
 * TODO: Create a Layer.effect for DbService that reads ConfigService
 * to construct the query method.
 * query(sql) should return `"${host}:${port} > ${sql}"`.
 */
export const dbLayer: Layer.Layer<DbService, never, ConfigService> =
	Layer.succeed(DbService, {
		query: () => Effect.succeed(""), // Replace with Layer.effect implementation
	})

/**
 * TODO: Merge configLayer and loggerLayer into a single layer
 * that provides both ConfigService and LoggerService.
 */
export const mergedLayer: Layer.Layer<ConfigService | LoggerService> =
	configLayer // Replace with Layer.merge

/**
 * TODO: Create an Effect that reads host and port from ConfigService,
 * returns them as a string "host:port".
 * Then provide configLayer so the effect has no remaining requirements.
 */
export const providedProgram: Effect.Effect<string> = Effect.succeed("") // Replace

/**
 * TODO: Build a full stack:
 * 1. configLayer feeds into dbLayer (use Layer.provide)
 * 2. Merge the result with loggerLayer
 * 3. Create a program that uses DbService to query "SELECT 1"
 * 4. Provide the full layer to the program
 */
export const fullStack: Effect.Effect<string> = Effect.succeed("") // Replace
