# Combining Effects

## Концепция

Effect предоставляет мощные операторы для комбинирования нескольких эффектов.

### `Effect.zip`
Комбинирует два Effect в tuple:
```typescript
const a = Effect.succeed(1)
const b = Effect.succeed("hello")

const combined = Effect.zip(a, b)
// Effect<[number, string]> - [1, "hello"]
```

### `Effect.zipWith`
Комбинирует два Effect с функцией:
```typescript
const sum = Effect.zipWith(
  Effect.succeed(2),
  Effect.succeed(3),
  (a, b) => a + b
)
// Effect<number> - 5
```

### `Effect.all`
Комбинирует массив или объект Effects:
```typescript
// Массив
const array = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// Effect<[number, number, number]>

// Объект
const object = Effect.all({
  name: Effect.succeed("John"),
  age: Effect.succeed(25)
})
// Effect<{ name: string, age: number }>
```

### `Effect.struct`
Алиас для `Effect.all` с объектом:
```typescript
const user = Effect.struct({
  id: Effect.succeed(1),
  name: Effect.succeed("John"),
  email: Effect.succeed("john@example.com")
})
// Effect<{ id: number, name: string, email: string }>
```

### `Effect.tuple`
Алиас для `Effect.all` с массивом:
```typescript
const data = Effect.tuple(
  Effect.succeed(1),
  Effect.succeed("hello"),
  Effect.succeed(true)
)
// Effect<[number, string, boolean]>
```

### Опции комбинирования
```typescript
// Последовательное выполнение
Effect.all(effects, { concurrency: 1 })

// Параллельное выполнение
Effect.all(effects, { concurrency: "unbounded" })

// Ограниченная параллельность
Effect.all(effects, { concurrency: 5 })

// Fail fast (остановиться на первой ошибке)
Effect.all(effects, { mode: "default" })

// Собрать все ошибки
Effect.all(effects, { mode: "validate" })
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **zipTwo** - объединить два Effect в tuple используя zip
2. **zipWithSum** - объединить два числа и сложить их используя zipWith
3. **combineArray** - объединить массив Effects используя all
4. **combineObject** - объединить объект Effects используя struct
5. **parallelFetch** - симулировать параллельные запросы с ограничением concurrency

## Примеры

```typescript
import { Effect } from "effect"

// zip - простое комбинирование
const pair = Effect.zip(
  Effect.succeed(42),
  Effect.succeed("answer")
)
// [42, "answer"]

// zipWith - с трансформацией
const sum = Effect.zipWith(
  Effect.succeed(10),
  Effect.succeed(32),
  (a, b) => a + b
)
// 42

// all с массивом
const numbers = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// [1, 2, 3]

// all с объектом (или struct)
const user = Effect.all({
  id: Effect.succeed(1),
  name: Effect.succeed("John"),
  verified: Effect.succeed(true)
})
// { id: 1, name: "John", verified: true }

// tuple - альтернативный синтаксис
const data = Effect.tuple(
  Effect.succeed(1),
  Effect.succeed("hello")
)
// [1, "hello"]

// Параллельность
const parallel = Effect.all(
  [task1, task2, task3],
  { concurrency: "unbounded" }
)

// Ограниченная параллельность
const limited = Effect.all(
  [task1, task2, task3, task4, task5],
  { concurrency: 2 } // максимум 2 одновременно
)

// Собрать все ошибки
const validated = Effect.all(
  [validation1, validation2, validation3],
  { mode: "validate" }
)
```

## Подсказки

- `zip` для двух Effects
- `zipWith` когда нужно сразу трансформировать результат
- `all` для массивов и объектов
- `struct` - более явный алиас для объектов
- `tuple` - более явный алиас для массивов
- `concurrency` опция контролирует параллельность
- `mode: "validate"` собирает все ошибки вместо fail-fast

## Бонус

Попробуйте:
- Использовать `Effect.validate` для сбора всех ошибок валидации
- Комбинировать `zip` с `map` для сложных трансформаций
- Создать вложенные структуры с `all`
- Использовать `Effect.forEach` + `Effect.all` для сложных паттернов
- Измерить разницу во времени выполнения sequential vs parallel
