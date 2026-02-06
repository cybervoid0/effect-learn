# Fallback Strategies

## Концепция

Effect предоставляет мощные стратегии для обработки ошибок через fallback, retry и timeout.

### `orElse`
Пробует альтернативный Effect если первый падает:
```typescript
const primary = Effect.fail("primary failed")
const fallback = Effect.succeed("fallback value")

const result = primary.pipe(Effect.orElse(() => fallback))
// Effect<string, never> - успех с fallback значением
```

### `retry`
Повторяет Effect при ошибке:
```typescript
import { Schedule } from "effect"

const unstable = Effect.fail("temporary error")

const withRetry = unstable.pipe(
  Effect.retry(Schedule.recurs(3)) // попробует 3 раза
)
```

### `timeout`
Устанавливает таймаут на операцию:
```typescript
const slow = Effect.sleep("10 seconds").pipe(
  Effect.andThen(Effect.succeed("done"))
)

const withTimeout = slow.pipe(
  Effect.timeout("2 seconds") // упадёт с TimeoutException через 2 секунды
)
```

### `timeoutTo`
Timeout с fallback значением:
```typescript
const result = slow.pipe(
  Effect.timeoutTo({
    duration: "2 seconds",
    onTimeout: () => Effect.succeed("timed out")
  })
)
```

### Комбинирование стратегий
Можно комбинировать несколько стратегий:
```typescript
const robust = riskyOperation.pipe(
  Effect.retry(Schedule.exponential("100 millis")),
  Effect.timeout("5 seconds"),
  Effect.orElse(() => fallbackOperation)
)
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **withFallback** - попробовать primary, если падает - использовать fallback
2. **retryThreeTimes** - повторить операцию до 3 раз при ошибке
3. **withTimeout** - добавить timeout 1 секунду к операции
4. **retryWithExponentialBackoff** - retry с экспоненциальной задержкой
5. **robustOperation** - комбинация retry + timeout + fallback

## Примеры

```typescript
import { Effect, Schedule } from "effect"

// orElse - fallback
const withFallback = Effect.fail("error").pipe(
  Effect.orElse(() => Effect.succeed("fallback"))
)

// retry - простой
const withRetry = unstableOperation.pipe(
  Effect.retry(Schedule.recurs(3))
)

// retry - с политикой
const withBackoff = unstableOperation.pipe(
  Effect.retry(
    Schedule.exponential("100 millis").pipe(
      Schedule.compose(Schedule.recurs(5))
    )
  )
)

// timeout
const withTimeout = slowOperation.pipe(
  Effect.timeout("5 seconds")
)

// timeoutTo - с fallback
const withTimeoutFallback = slowOperation.pipe(
  Effect.timeoutTo({
    duration: "5 seconds",
    onTimeout: () => Effect.succeed("default")
  })
)

// Комбинация
const robust = riskyOperation.pipe(
  Effect.retry(Schedule.recurs(3)),
  Effect.timeout("10 seconds"),
  Effect.orElse(() => fallbackOperation)
)
```

## Подсказки

- `orElse` принимает функцию `() => Effect`
- `retry` принимает `Schedule` - используй `Schedule.recurs(n)`
- `timeout` принимает duration как строку: `"1 second"`, `"500 millis"`
- `Schedule.exponential` для экспоненциального backoff
- `Schedule.compose` для комбинирования schedules
- Порядок важен: обычно retry → timeout → orElse

## Бонус

Попробуйте:
- Создать custom Schedule с jitter
- Использовать `retryOrElse` для обработки после всех retry
- Добавить логирование каждой попытки retry
- Реализовать circuit breaker паттерн
- Использовать `Schedule.spaced` для fixed delay между retry
