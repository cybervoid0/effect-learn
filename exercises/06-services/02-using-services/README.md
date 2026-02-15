# Using Services — Composition & Patterns

## Concept

Once you know how to define services, the real power comes from **composing**
them. In real applications a program rarely needs just one service — it
orchestrates several together.

### Accessing multiple services

```typescript
const program = Effect.gen(function* () {
  const db = yield* DbService
  const logger = yield* LoggerService
  yield* logger.info("Fetching user...")
  return yield* db.findUser("123")
})
// Type: Effect<User, DbError, DbService | LoggerService>
//                              ^^^^^^^^^^^^^^^^^^^^^^^^
//                              Both services are tracked!
```

### Service functions — wrapping access

A common pattern is to create helper functions that hide the `yield*`:

```typescript
const findUser = (id: string) =>
  Effect.gen(function* () {
    const db = yield* DbService
    return yield* db.findUser(id)
  })
```

Or using `Effect.andThen` / `Effect.flatMap` for one-liners:

```typescript
const findUser = (id: string) =>
  DbService.pipe(Effect.andThen((db) => db.findUser(id)))
```

### Error recovery with services

Services naturally integrate with Effect's error channel:

```typescript
const safeFind = (id: string) =>
  findUser(id).pipe(
    Effect.catchTag("UserNotFound", () => Effect.succeed(defaultUser))
  )
```

## Assignment

Build a logging + user-management system with two services.

### Services (define them yourself):

**Logger** — tag `"Logger"`:
- `info: (msg: string) => Effect.Effect<void>`
- `error: (msg: string) => Effect.Effect<void>`

**UserRepo** — tag `"UserRepo"`:
- `findById: (id: string) => Effect.Effect<User, UserNotFound>`
- `save: (user: User) => Effect.Effect<void>`

### Types (define them yourself):

- `User` — `{ readonly id: string; readonly name: string }`
- `UserNotFound` — tagged error with `id: string` field

### Tasks:

1. **loggedFind** — find a user by id. Log `"looking up: <id>"` before
   the lookup using `logger.info`. Return the user.

2. **findOrCreate** — try to find user by id. If `UserNotFound`,
   create a new `User` with the given `id` and `name`, save it,
   log `"created: <id>"` with `logger.info`, and return the new user.

3. **renameUser** — find user by id, create a new user object with
   updated name, save it, log `"renamed: <id>"` with `logger.info`,
   return the updated user.

4. **batchLookup** — given an array of ids, look up each user.
   Collect results as `Array<Either<User, UserNotFound>>` using
   `Effect.either`. The logger should log `"batch: <count> ids"` once
   at the start.

## Hints

- All tasks require both `Logger` and `UserRepo` in the `R` channel
- Use `Effect.gen` to access services
- `Data.TaggedError` for `UserNotFound`
- For `batchLookup`, use `Effect.forEach` + `Effect.either`
- `Either.right` contains success, `Either.left` contains the error

## Examples

```typescript
// Test layer creation pattern:
const TestLogger = Layer.succeed(Logger, {
  info: (msg) => Ref.update(log, (arr) => [...arr, `INFO: ${msg}`]),
  error: (msg) => Ref.update(log, (arr) => [...arr, `ERROR: ${msg}`]),
})
```
