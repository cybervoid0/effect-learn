# Expected Errors

## Концепция

В Effect ошибки являются **частью типа**. Это означает что компилятор знает какие ошибки может выбросить функция и заставляет вас их обработать.

### Типизированные ошибки

```typescript
Effect<Success, Error, Requirements>
//     ^^^^^^^  ^^^^^
//     Что вернёт  Какие ошибки может выбросить
```

### `Effect.fail`
Создаёт Effect который падает с типизированной ошибкой:
```typescript
const error = Effect.fail("Something went wrong")
// Effect<never, string, never>
//       ^^^^^  ^^^^^^
//       никогда не вернёт успех, ошибка типа string
```

### Tagged Errors (Data.TaggedError)
Рекомендуемый способ создания ошибок в Effect:
```typescript
import { Data } from "effect"

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly message: string
}> {}

const error = new NetworkError({ message: "Connection failed" })
```

### Множественные типы ошибок
Effect может иметь union типов ошибок:
```typescript
type AppError = NetworkError | ValidationError | DatabaseError

const program: Effect.Effect<User, AppError> = ...
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **createSimpleError** - создать Effect с простой строковой ошибкой
2. **createTaggedError** - создать класс tagged error и использовать его
3. **parseNumber** - парсить строку в число, возвращать ошибку если невалидно
4. **divideWithError** - делить числа с типизированной ошибкой при делении на ноль
5. **validateAge** - валидировать возраст (должен быть >= 0 и <= 120)

## Примеры

```typescript
import { Effect, Data } from "effect"

// Простая строковая ошибка
const simpleError = Effect.fail("Oops!")

// Tagged error
class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly id: string
}> {}

const notFound = Effect.fail(new NotFoundError({ id: "123" }))

// Функция с типизированной ошибкой
const getUser = (id: string): Effect.Effect<User, NotFoundError> => {
  if (id === "unknown") {
    return Effect.fail(new NotFoundError({ id }))
  }
  return Effect.succeed({ id, name: "John" })
}

// Множественные типы ошибок
class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string
}> {}

const validateAndFetch = (id: string): Effect.Effect<
  User,
  NotFoundError | ValidationError
> => {
  if (id.length === 0) {
    return Effect.fail(new ValidationError({ field: "id" }))
  }
  return getUser(id)
}
```

## Подсказки

- Используйте `Effect.fail` для создания ошибок
- `Data.TaggedError` для создания классов ошибок
- `_tag` поле автоматически добавляется в tagged errors
- Типы ошибок объединяются через `|` (union)
- `isNaN()` для проверки числа
- Используйте условную логику для валидации

## Бонус

Попробуйте:
- Создать иерархию ошибок (базовый класс + наследники)
- Добавить дополнительные поля в ошибки (timestamp, stack trace)
- Создать helper функцию для создания ошибок с контекстом
- Использовать `Effect.gen` для композиции функций с ошибками
