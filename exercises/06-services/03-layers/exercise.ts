import { Context, Effect, Layer } from "effect"

// ============================================================
// Define the three services
// ============================================================

// TODO: Define AppConfig service tag ("AppConfig") with:

interface AppConfigApi {
	dbUrl: string
	maxRetries: number
}

export class AppConfig extends Context.Tag("AppConfig")<
	AppConfig,
	AppConfigApi
>() {}

// TODO: Define Database service tag ("Database") with:
//   query: (sql: string) => Effect.Effect<string>
interface DatabaseApi {
	query: (sql: string) => Effect.Effect<string>
}

export class Database extends Context.Tag("Database")<
	Database,
	DatabaseApi
>() {}

// TODO: Define UserService service tag ("UserService") with:
//   getUser: (id: string) => Effect.Effect<string>
interface UserServiceApi {
	getUser: (id: string) => Effect.Effect<string>
}

export class UserService extends Context.Tag("UserService")<
	UserService,
	UserServiceApi // <-- Replace with real interface
>() {}

// ============================================================
// Exercise 1: Config layer (no dependencies)
// ============================================================

// Create a Layer.succeed with:
//   dbUrl: "postgres://localhost"
//   maxRetries: 3
export const configLayer: Layer.Layer<AppConfig> = Layer.succeed(AppConfig, {
	dbUrl: "postgres://localhost",
	maxRetries: 3,
}) // <-- Replace

// ============================================================
// Exercise 2: Database layer (depends on AppConfig)
// ============================================================

// Use Layer.effect + Effect.gen to:
// 1. yield* AppConfig to get config
// 2. Return implementation where query(sql) returns:
//    Effect.succeed(`[${config.dbUrl}] result: ${sql}`)
export const databaseLayer: Layer.Layer<Database, never, AppConfig> =
	Layer.effect(
		Database,
		Effect.gen(function* () {
			const { dbUrl } = yield* AppConfig
			return { query: (sql) => Effect.succeed(`[${dbUrl}] result: ${sql}`) }
		}),
	)

//const ConfiguredDatabase = Layer.provide(databaseLayer, configLayer)

// ============================================================
// Exercise 3: UserService layer (depends on Database)
// ============================================================

// Use Layer.effect + Effect.gen to:
// 1. yield* Database to get db
// 2. Return implementation where getUser(id) calls:
//    db.query(`SELECT * FROM users WHERE id = '${id}'`)
export const userServiceLayer: Layer.Layer<UserService, never, Database> =
	Layer.effect(UserService)(
		Effect.gen(function* () {
			const db = yield* Database
			return {
				getUser: (id) => db.query(`SELECT * FROM users WHERE id = '${id}'`),
			}
		}),
	)

// ============================================================
// Exercise 4: Resolve database dependencies
// ============================================================

// Provide configLayer to databaseLayer to eliminate AppConfig requirement
export const resolvedDatabaseLayer: Layer.Layer<Database> = Layer.provide(
	databaseLayer,
	configLayer,
)

// ============================================================
// Exercise 5: Full application layer
// ============================================================

// Compose everything into a single layer that provides
// AppConfig, Database, AND UserService — with NO requirements.
// Hint: you need to merge layers and resolve all dependencies
const ServiceWithDatabase = Layer.provide(
	userServiceLayer,
	resolvedDatabaseLayer,
)
export const fullAppLayer: Layer.Layer<AppConfig | Database | UserService> =
	Layer.mergeAll(resolvedDatabaseLayer, ServiceWithDatabase, configLayer)
