# Layers — Composing Dependencies

## Concept

Layers are recipes for building services. The real power is that layers can
**depend on other layers**, forming a dependency graph that Effect resolves
automatically.

### Layer types

```
Layer<Out, Error, In>
       ↑    ↑     ↑
       |    |     └── Services needed to build this layer
       |    └── Errors that can occur during construction
       └── Services this layer provides
```

### Construction patterns

```typescript
// Simple: no dependencies, no effects
Layer.succeed(MyService, implementation)

// Effectful: can use Effects during construction (e.g. create Ref)
Layer.effect(MyService, Effect.gen(function* () {
  const state = yield* Ref.make(0)
  return { /* impl using state */ }
}))

// Dependent: needs another service to build
Layer.effect(DbService, Effect.gen(function* () {
  const config = yield* ConfigService  // Depends on ConfigService!
  return { query: (sql) => /* use config.connectionString */ }
}))
// Type: Layer<DbService, never, ConfigService>
//                                ^^^^^^^^^^^^
```

### Composition operators

```typescript
// Merge — combine independent layers (both provided)
const AppLayer = Layer.merge(LoggerLayer, ConfigLayer)
// Type: Layer<Logger | Config, never, never>

// Provide — satisfy a layer's dependency
// If DbLayer needs Config, and ConfigLayer provides Config:
const ResolvedDbLayer = Layer.provide(DbLayer, ConfigLayer)
// Type: Layer<DbService, never, never>  ← Config requirement eliminated

// MergeAll — merge many layers
const FullStack = Layer.mergeAll(LoggerLayer, ConfigLayer, ResolvedDbLayer)
```

## Assignment

Build a 3-tier application stack: Config → Database → UserService.

### Define these services:

**AppConfig** — tag `"AppConfig"`:
- `dbUrl: string`
- `maxRetries: number`

**Database** — tag `"Database"`:
- `query: (sql: string) => Effect.Effect<string>`

**UserService** — tag `"UserService"`:
- `getUser: (id: string) => Effect.Effect<string>`

### Tasks:

1. **configLayer** — `Layer<AppConfig>` using `Layer.succeed` with
   `dbUrl: "postgres://localhost"`, `maxRetries: 3`

2. **databaseLayer** — `Layer<Database, never, AppConfig>` using `Layer.effect`.
   Access `AppConfig` to read `dbUrl`. Implement `query` as:
   `Effect.succeed(\`[\${dbUrl}] result: \${sql}\`)`

3. **userServiceLayer** — `Layer<UserService, never, Database>` using `Layer.effect`.
   Access `Database`. Implement `getUser` as:
   `db.query(\`SELECT * FROM users WHERE id = '\${id}'\`)`

4. **resolvedDatabaseLayer** — Provide `configLayer` to `databaseLayer`
   so it becomes `Layer<Database>` (no more `AppConfig` requirement)

5. **fullAppLayer** — Compose everything into a single
   `Layer<AppConfig | Database | UserService>` that has NO requirements.
   All three services available, fully resolved.

## Hints

- `Layer.effect(Tag, Effect.gen(...))` — when the layer needs to access
  another service during construction
- `Layer.provide(layerThatNeeds, layerThatProvides)` — wires dependencies
- `Layer.merge` / `Layer.mergeAll` — combines independent layers
- To expose ALL three services, you need to merge the individual layers
  after resolving their dependencies
- Think about the dependency graph:
  ```
  ConfigLayer ──→ DatabaseLayer ──→ UserServiceLayer
  ```

## Examples

```typescript
// Verifying the full stack works:
const program = Effect.gen(function* () {
  const userService = yield* UserService
  return yield* userService.getUser("42")
})

const result = await Effect.runPromise(
  program.pipe(Effect.provide(fullAppLayer))
)
// result: "[postgres://localhost] result: SELECT * FROM users WHERE id = '42'"
```
