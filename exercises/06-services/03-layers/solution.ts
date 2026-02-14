import { Context, Effect, Layer } from "effect"

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

export const loggerLayer: Layer.Layer<LoggerService> = Layer.succeed(
	LoggerService,
	{ log: () => Effect.void },
)

/**
 * Simple config layer
 */
export const configLayer: Layer.Layer<ConfigService> = Layer.succeed(
	ConfigService,
	{ host: "localhost", port: 3000 },
)

/**
 * DB layer that depends on ConfigService
 */
export const dbLayer: Layer.Layer<DbService, never, ConfigService> =
	Layer.effect(
		DbService,
		Effect.gen(function* () {
			const config = yield* ConfigService
			return {
				query: (sql: string) =>
					Effect.succeed(`${config.host}:${config.port} > ${sql}`),
			}
		}),
	)

/**
 * Merged layer providing both Config and Logger
 */
export const mergedLayer: Layer.Layer<ConfigService | LoggerService> =
	Layer.merge(configLayer, loggerLayer)

/**
 * Program fully provided with configLayer
 */
export const providedProgram: Effect.Effect<string> = Effect.gen(
	function* () {
		const config = yield* ConfigService
		return `${config.host}:${config.port}`
	},
).pipe(Effect.provide(configLayer))

/**
 * Full stack: config -> db, merged with logger
 */
export const fullStack: Effect.Effect<string> = Effect.gen(function* () {
	const db = yield* DbService
	return yield* db.query("SELECT 1")
}).pipe(
	Effect.provide(
		Layer.merge(Layer.provide(dbLayer, configLayer), loggerLayer),
	),
)
