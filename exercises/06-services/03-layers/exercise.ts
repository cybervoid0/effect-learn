import { Context, Effect, Layer } from "effect"

// ============================================================
// Define the three services
// ============================================================

// TODO: Define AppConfig service tag ("AppConfig") with:
//   dbUrl:      string
//   maxRetries: number

export class AppConfig extends Context.Tag("AppConfig")<
	AppConfig,
	Record<string, never> // <-- Replace with real interface
>() {}

// TODO: Define Database service tag ("Database") with:
//   query: (sql: string) => Effect.Effect<string>

export class Database extends Context.Tag("Database")<
	Database,
	Record<string, never> // <-- Replace with real interface
>() {}

// TODO: Define UserService service tag ("UserService") with:
//   getUser: (id: string) => Effect.Effect<string>

export class UserService extends Context.Tag("UserService")<
	UserService,
	Record<string, never> // <-- Replace with real interface
>() {}

// ============================================================
// Exercise 1: Config layer (no dependencies)
// ============================================================

// Create a Layer.succeed with:
//   dbUrl: "postgres://localhost"
//   maxRetries: 3
export const configLayer: Layer.Layer<AppConfig> =
	Layer.succeed(AppConfig, {} as never) // <-- Replace

// ============================================================
// Exercise 2: Database layer (depends on AppConfig)
// ============================================================

// Use Layer.effect + Effect.gen to:
// 1. yield* AppConfig to get config
// 2. Return implementation where query(sql) returns:
//    Effect.succeed(`[${config.dbUrl}] result: ${sql}`)
export const databaseLayer: Layer.Layer<Database, never, AppConfig> =
	Layer.succeed(Database, {} as never) as never // <-- Replace with Layer.effect(...)

// ============================================================
// Exercise 3: UserService layer (depends on Database)
// ============================================================

// Use Layer.effect + Effect.gen to:
// 1. yield* Database to get db
// 2. Return implementation where getUser(id) calls:
//    db.query(`SELECT * FROM users WHERE id = '${id}'`)
export const userServiceLayer: Layer.Layer<
	UserService,
	never,
	Database
> = Layer.succeed(UserService, {} as never) as never // <-- Replace with Layer.effect(...)

// ============================================================
// Exercise 4: Resolve database dependencies
// ============================================================

// Provide configLayer to databaseLayer to eliminate AppConfig requirement
export const resolvedDatabaseLayer: Layer.Layer<Database> =
	databaseLayer as never // <-- Replace with Layer.provide(...)

// ============================================================
// Exercise 5: Full application layer
// ============================================================

// Compose everything into a single layer that provides
// AppConfig, Database, AND UserService — with NO requirements.
// Hint: you need to merge layers and resolve all dependencies
export const fullAppLayer: Layer.Layer<
	AppConfig | Database | UserService
> = configLayer as never // <-- Replace with proper composition
