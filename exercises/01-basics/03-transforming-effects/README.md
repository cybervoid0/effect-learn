# Transforming Effects

## Концепция

Effect предоставляет мощные операторы для трансформации и композиции эффектов.

### `map`
Трансформирует успешное значение Effect:
```typescript
const doubled = Effect.succeed(21).pipe(
  Effect.map(n => n * 2)
)
// Effect<number, never, never> -> 42
```

### `flatMap`
Цепочка зависимых Effect (монадическая композиция):
```typescript
const getUserAge = (id: string) => Effect.succeed(25)
const canVote = (age: number) => Effect.succeed(age >= 18)

const result = getUserAge("123").pipe(
  Effect.flatMap(age => canVote(age))
)
```

### `andThen`
Универсальный оператор для последовательной композиции:
```typescript
// С функцией
effect.pipe(Effect.andThen(x => Effect.succeed(x * 2)))

// С Effect
effect.pipe(Effect.andThen(Effect.succeed(42)))

// С константой
effect.pipe(Effect.andThen(42))
```

### `tap`
Выполняет side-effect не изменяя результат:
```typescript
const logged = Effect.succeed(42).pipe(
  Effect.tap(n => Effect.sync(() => console.log(n)))
)
// Effect<number, never, never> -> 42 (но с логированием)
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. `doubleValue` - удвоить значение Effect
2. `chainEffects` - создать цепочку из двух Effect
3. `transformToString` - преобразовать число в строку
4. `logAndReturn` - залогировать значение и вернуть его
5. `calculateTotal` - сложная композиция нескольких операций

## Примеры

```typescript
import { Effect } from "effect"

// map - простая трансформация
const doubled = Effect.succeed(21).pipe(
  Effect.map(n => n * 2)
)

// flatMap - зависимые операции
const divide = (a: number, b: number) =>
  b === 0 
    ? Effect.fail("Division by zero")
    : Effect.succeed(a / b)

const result = Effect.succeed(10).pipe(
  Effect.flatMap(x => divide(x, 2))
)

// tap - side effects
const withLogging = Effect.succeed(42).pipe(
  Effect.tap(n => Effect.sync(() => console.log(`Value: ${n}`)))
)

// Композиция
const complex = Effect.succeed(5).pipe(
  Effect.map(n => n * 2),           // 10
  Effect.tap(n => Effect.log(n)),   // log: 10
  Effect.flatMap(n => 
    n > 5 
      ? Effect.succeed(n) 
      : Effect.fail("Too small")
  ),
  Effect.map(n => `Result: ${n}`)   // "Result: 10"
)
```

## Подсказки

- `map` для простых трансформаций значения
- `flatMap` когда следующая операция возвращает Effect
- `andThen` как универсальная альтернатива
- `tap` для side-effects (логирование, метрики)
- Используйте `pipe` для читаемых цепочек

## Бонус

Попробуйте:
- Создать цепочку из 5+ операций
- Использовать `Effect.gen` вместо `pipe`
- Добавить обработку ошибок в цепочку
- Реализовать retry логику с трансформацией
