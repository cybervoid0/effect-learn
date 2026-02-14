import { Config, ConfigError, Effect } from "effect"

/**
 * TODO: Read a string config value for key "APP_NAME".
 * Use Config.string.
 */
export const readStringConfig: Effect.Effect<string, ConfigError.ConfigError> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Read a number config value for key "PORT".
 * Use Config.number.
 */
export const readNumberConfig: Effect.Effect<number, ConfigError.ConfigError> = Effect.succeed(0) // Replace with correct implementation

/**
 * TODO: Read string config "LOG_LEVEL" with a default of "info".
 * Use Config.string and Config.withDefault.
 */
export const configWithDefault: Effect.Effect<string> = Effect.succeed("") // Replace with correct implementation

/**
 * TODO: Combine Config.string("HOST") and Config.number("PORT")
 * into an object { host: string, port: number }.
 * Use Effect.all with a struct.
 */
export const combinedConfig: Effect.Effect<
	{ readonly host: string; readonly port: number },
	ConfigError.ConfigError
> = Effect.succeed({ host: "", port: 0 }) // Replace with correct implementation

/**
 * TODO: Read Config.number("PORT") and multiply it by 10
 * using Config.map.
 */
export const mappedConfig: Effect.Effect<number, ConfigError.ConfigError> = Effect.succeed(0) // Replace with correct implementation
