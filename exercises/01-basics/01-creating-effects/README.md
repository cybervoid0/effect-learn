# Creating Effects

## Концепция

В Effect, `Effect<A, E, R>` - это описание вычисления, которое:
- Возвращает значение типа `A` при успехе
- Может упасть с ошибкой типа `E`
- Требует окружение (context) типа `R`

Effect - это **ленивое** описание программы. Оно не выполняется до тех пор, пока вы явно не запустите его.

## Основные способы создания Effect

### `Effect.succeed`
Создает Effect, который всегда успешно возвращает значение:
```typescript
const effect = Effect.succeed(42)
// Effect<number, never, never>
```

### `Effect.fail`
Создает Effect, который всегда падает с ошибкой:
```typescript
const effect = Effect.fail("Oops!")
// Effect<never, string, never>
```

### `Effect.sync`
Создает Effect из синхронной функции:
```typescript
const effect = Effect.sync(() => Math.random())
// Effect<number, never, never>
```

### `Effect.try`
Создает Effect из функции, которая может бросить исключение:
```typescript
const effect = Effect.try(() => JSON.parse('{"key": "value"}'))
// Effect<any, UnknownException, never>
```

### `Effect.promise`
Создает Effect из функции, возвращающей Promise:
```typescript
const effect = Effect.promise(() => fetch("https://api.example.com"))
// Effect<Response, never, never>
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. `createSuccessEffect` - создает Effect, возвращающий число 42
2. `createFailureEffect` - создает Effect, падающий с ошибкой "Something went wrong"
3. `createRandomEffect` - создает Effect, возвращающий случайное число от 0 до 100
4. `createDateEffect` - создает Effect, возвращающий текущую дату в формате ISO string
5. `createDivisionEffect` - создает Effect, делящий два числа (обработайте деление на ноль)

## Примеры

```typescript
import { Effect } from "effect"

// Простой успешный Effect
const greeting = Effect.succeed("Hello, Effect!")

// Effect с вычислением
const computation = Effect.sync(() => {
  console.log("Computing...")
  return 2 + 2
})

// Effect с возможной ошибкой
const parseJSON = (text: string) =>
  Effect.try({
    try: () => JSON.parse(text),
    catch: (error) => new Error(`Parse error: ${error}`)
  })
```

## Подсказки

- `Effect.succeed` для простых значений
- `Effect.sync` когда нужно выполнить код, но он не может упасть
- `Effect.try` когда код может бросить исключение
- Для деления на ноль используйте `Effect.fail` или условную логику с `Effect.sync`

## Бонус

Попробуйте создать Effect, который:
- Читает переменную окружения `NODE_ENV`
- Возвращает "development" если переменная не установлена
- Использует `Effect.sync` и `process.env`
