# Catching Errors

## Концепция

Effect предоставляет мощные операторы для обработки ошибок. В отличие от try-catch, обработка ошибок в Effect **типобезопасна** и **композируема**.

### `catchAll`
Ловит все ошибки и восстанавливается:
```typescript
const program = Effect.fail("error").pipe(
  Effect.catchAll(error => Effect.succeed("recovered"))
)
// Effect<string, never> - ошибка обработана!
```

### `catchTag`
Ловит ошибки по тегу (для tagged errors):
```typescript
class NetworkError extends Data.TaggedError("NetworkError")<{}> {}
class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

const program = riskyOperation.pipe(
  Effect.catchTag("NetworkError", () => Effect.succeed("network fallback"))
)
// Обрабатывает только NetworkError, ValidationError остаётся
```

### `catchSome`
Условная обработка ошибок:
```typescript
const program = Effect.fail("error").pipe(
  Effect.catchSome(error => 
    error === "retryable" 
      ? Option.some(Effect.succeed("recovered"))
      : Option.none()
  )
)
```

### `match`
Pattern matching на Success/Failure:
```typescript
const result = program.pipe(
  Effect.match({
    onFailure: error => `Error: ${error}`,
    onSuccess: value => `Success: ${value}`
  })
)
// Effect<string, never> - всегда успех!
```

### `matchEffect`
Pattern matching с Effect в обоих случаях:
```typescript
const result = program.pipe(
  Effect.matchEffect({
    onFailure: error => Effect.succeed(`Error: ${error}`),
    onSuccess: value => Effect.succeed(`Success: ${value}`)
  })
)
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **recoverFromError** - поймать любую ошибку и вернуть fallback значение
2. **recoverFromSpecificError** - поймать только NetworkError
3. **retryOnRetryableError** - условно обработать "retryable" ошибки
4. **matchResult** - использовать match для преобразования Success/Failure в строку
5. **chainWithErrorHandling** - цепочка операций с обработкой ошибок на каждом шаге

## Примеры

```typescript
import { Effect, Data, Option } from "effect"

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

// catchAll - ловит все ошибки
const safe = Effect.fail("oops").pipe(
  Effect.catchAll(() => Effect.succeed("recovered"))
)

// catchTag - ловит по тегу
const program = Effect.fail(new NetworkError({ message: "timeout" })).pipe(
  Effect.catchTag("NetworkError", (error) => 
    Effect.succeed(`Recovered from: ${error.message}`)
  )
)

// catchSome - условная обработка
const conditional = Effect.fail("error").pipe(
  Effect.catchSome(error => {
    if (error.startsWith("retry")) {
      return Option.some(Effect.succeed("retried"))
    }
    return Option.none()
  })
)

// match - pattern matching
const matched = Effect.succeed(42).pipe(
  Effect.match({
    onFailure: () => "failed",
    onSuccess: (n) => `success: ${n}`
  })
)

// Цепочка с обработкой
const chain = Effect.succeed(10).pipe(
  Effect.flatMap(n => 
    n > 5 
      ? Effect.succeed(n * 2) 
      : Effect.fail("too small")
  ),
  Effect.catchAll(() => Effect.succeed(0))
)
```

## Подсказки

- `catchAll` принимает функцию `(error) => Effect`
- `catchTag` работает только с tagged errors
- `catchSome` возвращает `Option<Effect>` - используй `Option.some` и `Option.none`
- `match` всегда возвращает успешный Effect
- Можно комбинировать несколько `catchTag` для разных ошибок
- `Effect.gen` удобен для сложных цепочек с try-catch стилем

## Бонус

Попробуйте:
- Использовать `catchTags` для обработки нескольких типов ошибок
- Создать retry логику с `catchAll` + рекурсия
- Использовать `Effect.gen` с try-catch стилем обработки
- Создать middleware паттерн для централизованной обработки ошибок
