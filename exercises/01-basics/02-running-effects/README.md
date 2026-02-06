# Running Effects

## Концепция

Effect - это **ленивое** описание вычисления. Чтобы получить результат, нужно **запустить** Effect используя один из методов:

### `Effect.runSync`
Запускает Effect синхронно и возвращает результат. Бросает исключение если Effect падает или асинхронный.
```typescript
const result = Effect.runSync(Effect.succeed(42))
// result: 42
```

### `Effect.runPromise`
Запускает Effect и возвращает Promise с результатом.
```typescript
const result = await Effect.runPromise(Effect.succeed(42))
// result: 42
```

### `Effect.runSyncExit`
Запускает Effect синхронно и возвращает `Exit` - структуру данных, которая представляет результат (успех или ошибку).
```typescript
const exit = Effect.runSyncExit(Effect.succeed(42))
// exit: Exit.Success<42>
```

### `Effect.runFork`
Запускает Effect в фоновом Fiber и возвращает `RuntimeFiber`.
```typescript
const fiber = Effect.runFork(Effect.succeed(42))
// fiber: RuntimeFiber<number, never>
```

## Когда использовать какой метод?

- **`runSync`** - когда Effect точно синхронный и не может упасть
- **`runSyncExit`** - когда нужно обработать ошибки синхронного Effect
- **`runPromise`** - когда Effect асинхронный или в async функциях
- **`runFork`** - когда нужно запустить Effect в фоне и продолжить выполнение

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. `runSimpleEffect` - запустите синхронный Effect и верните результат
2. `runEffectWithExit` - запустите Effect и верните Exit результат
3. `runAsyncEffect` - запустите асинхронный Effect через Promise
4. `runEffectInBackground` - запустите Effect в фоне и верните Fiber

## Примеры

```typescript
import { Effect } from "effect"

// Синхронный запуск
const value = Effect.runSync(Effect.succeed(42))
console.log(value) // 42

// С обработкой Exit
const exit = Effect.runSyncExit(Effect.fail("error"))
if (Exit.isFailure(exit)) {
  console.log("Failed!")
}

// Асинхронный запуск
await Effect.runPromise(
  Effect.promise(() => fetch("https://api.example.com"))
)

// Фоновый запуск
const fiber = Effect.runFork(
  Effect.gen(function* () {
    yield* Effect.sleep("1 second")
    return "Done!"
  })
)
```

## Подсказки

- `Effect.runSync` для простых синхронных Effect
- `Effect.runSyncExit` когда нужен `Exit` результат
- `Effect.runPromise` для асинхронных Effect
- `Effect.runFork` для фоновых задач
- Не забудьте про `await` с `runPromise`

## Бонус

Попробуйте:
- Запустить Effect с задержкой через `Effect.sleep`
- Получить результат из Fiber используя `Fiber.await`
- Обработать ошибку из Exit используя `Exit.match`
