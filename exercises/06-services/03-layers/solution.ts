import { Context, Effect, Layer } from "effect"

// Service definitions

export class AppConfig extends Context.Tag("AppConfig")<
	AppConfig,
	{
		readonly dbUrl: string
		readonly maxRetries: number
	}
>() {}

export class Database extends Context.Tag("Database")<
	Database,
	{
		readonly query: (sql: string) => Effect.Effect<string>
	}
>() {}

export class UserService extends Context.Tag("UserService")<
	UserService,
	{
		readonly getUser: (id: string) => Effect.Effect<string>
	}
>() {}

// Exercise 1: Config layer
export const configLayer: Layer.Layer<AppConfig> = Layer.succeed(
	AppConfig,
	{
		dbUrl: "postgres://localhost",
		maxRetries: 3,
	},
)

// Exercise 2: Database layer (depends on AppConfig)
export const databaseLayer: Layer.Layer<Database, never, AppConfig> =
	Layer.effect(
		Database,
		Effect.gen(function* () {
			const config = yield* AppConfig
			return {
				query: (sql: string) =>
					Effect.succeed(`[${config.dbUrl}] result: ${sql}`),
			}
		}),
	)

// Exercise 3: UserService layer (depends on Database)
export const userServiceLayer: Layer.Layer<
	UserService,
	never,
	Database
> = Layer.effect(
	UserService,
	Effect.gen(function* () {
		const db = yield* Database
		return {
			getUser: (id: string) =>
				db.query(`SELECT * FROM users WHERE id = '${id}'`),
		}
	}),
)

// Exercise 4: Resolve database dependencies
export const resolvedDatabaseLayer: Layer.Layer<Database> = Layer.provide(
	databaseLayer,
	configLayer,
)

// Exercise 5: Full application layer
export const fullAppLayer: Layer.Layer<
	AppConfig | Database | UserService
> = Layer.mergeAll(
	configLayer,
	Layer.provide(databaseLayer, configLayer),
	Layer.provide(
		userServiceLayer,
		Layer.provide(databaseLayer, configLayer),
	),
)
