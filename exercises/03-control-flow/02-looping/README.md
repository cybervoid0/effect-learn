# Looping

## Концепция

Effect предоставляет функциональные операторы для циклов и итераций.

### `Effect.loop`
Функциональный цикл с accumulator:
```typescript
const sum = Effect.loop(
  0,                    // начальное значение
  {
    while: n => n < 5,  // условие продолжения
    step: n => n + 1,   // следующее значение
    body: (n, acc) => Effect.succeed(acc + n) // тело цикла
  }
)
// Effect<number> - сумма 0+1+2+3+4 = 10
```

### `Effect.iterate`
Итерация с accumulator:
```typescript
const result = Effect.iterate(
  0,                    // начальное значение
  {
    while: n => n < 100,
    body: n => Effect.succeed(n + 1)
  }
)
// Effect<number> - 100
```

### `Effect.forEach`
Обработка массива элементов:
```typescript
const numbers = [1, 2, 3, 4, 5]

const doubled = Effect.forEach(numbers, n => 
  Effect.succeed(n * 2)
)
// Effect<number[]> - [2, 4, 6, 8, 10]
```

### `Effect.forEach` с опциями
```typescript
// Последовательная обработка
Effect.forEach(items, process, { concurrency: 1 })

// Параллельная обработка
Effect.forEach(items, process, { concurrency: "unbounded" })

// Ограниченная параллельность
Effect.forEach(items, process, { concurrency: 5 })

// Discard результаты
Effect.forEach(items, process, { discard: true })
```

### `Effect.all`
Комбинирование массива Effects:
```typescript
const effects = [
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
]

const result = Effect.all(effects)
// Effect<number[]> - [1, 2, 3]
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **sumNumbers** - сумма чисел от 1 до n используя loop
2. **factorial** - факториал числа используя iterate
3. **processArray** - обработать массив через forEach
4. **filterAndMap** - отфильтровать и преобразовать массив
5. **sequentialVsParallel** - сравнить последовательную и параллельную обработку

## Примеры

```typescript
import { Effect } from "effect"

// loop - с accumulator
const sum = Effect.loop(
  1,                        // start
  {
    while: n => n <= 5,     // while n <= 5
    step: n => n + 1,       // n++
    body: (n, acc) => Effect.succeed(acc + n)
  }
)
// 1 + 2 + 3 + 4 + 5 = 15

// iterate - проще чем loop
const countdown = Effect.iterate(
  10,
  {
    while: n => n > 0,
    body: n => Effect.succeed(n - 1)
  }
)
// 0

// forEach - обработка массива
const doubled = Effect.forEach(
  [1, 2, 3],
  n => Effect.succeed(n * 2)
)
// [2, 4, 6]

// forEach с фильтрацией
const evenDoubled = Effect.forEach(
  [1, 2, 3, 4, 5],
  n => n % 2 === 0 
    ? Effect.succeed(n * 2)
    : Effect.fail("odd")
).pipe(
  Effect.catchAll(() => Effect.succeed([]))
)

// all - комбинирование effects
const results = Effect.all([
  Effect.succeed(1),
  Effect.succeed(2),
  Effect.succeed(3)
])
// [1, 2, 3]
```

## Подсказки

- `Effect.loop` для циклов с accumulator
- `Effect.iterate` для простых итераций без accumulator
- `Effect.forEach` для обработки массивов
- `concurrency` опция контролирует параллельность
- `discard: true` если результаты не нужны
- Можно использовать `Effect.gen` с обычными циклами

## Бонус

Попробуйте:
- Реализовать fibonacci через loop
- Использовать `Effect.forEach` с `concurrency: 2`
- Создать while-подобный цикл через iterate
- Обработать массив с возможными ошибками
- Использовать `Effect.all` с объектом вместо массива
