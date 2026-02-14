import { Config, ConfigError, Effect } from "effect"

/**
 * Read a string config value for key "APP_NAME"
 */
export const readStringConfig: Effect.Effect<string, ConfigError.ConfigError> =
	Config.string("APP_NAME")

/**
 * Read a number config value for key "PORT"
 */
export const readNumberConfig: Effect.Effect<number, ConfigError.ConfigError> =
	Config.number("PORT")

/**
 * Read string config "LOG_LEVEL" with a default of "info"
 */
export const configWithDefault: Effect.Effect<string> =
	Config.string("LOG_LEVEL").pipe(Config.withDefault("info"))

/**
 * Combine HOST and PORT configs into an object
 */
export const combinedConfig: Effect.Effect<
	{ readonly host: string; readonly port: number },
	ConfigError.ConfigError
> = Effect.all({
	host: Config.string("HOST"),
	port: Config.number("PORT"),
})

/**
 * Read PORT config and multiply by 10
 */
export const mappedConfig: Effect.Effect<number, ConfigError.ConfigError> =
	Config.number("PORT").pipe(Config.map((n) => n * 10))
