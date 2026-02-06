# Conditional Logic

## Концепция

Effect предоставляет функциональные операторы для условной логики, которые работают с эффектами.

### `Effect.if`
Условное выполнение с Effect условием:
```typescript
const result = Effect.if(Effect.succeed(true), {
  onTrue: () => Effect.succeed("yes"),
  onFalse: () => Effect.succeed("no")
})
// Effect<string>
```

### `Effect.when`
Выполняет Effect только если условие true:
```typescript
const maybeLog = Effect.when(shouldLog, () => 
  Effect.log("Logging enabled")
)
// Effect<Option<void>> - Some(void) если true, None если false
```

### `Effect.unless`
Выполняет Effect только если условие false:
```typescript
const maybeError = Effect.unless(isValid, () =>
  Effect.fail("Invalid input")
)
```

### `Effect.filterOrFail`
Фильтрует значение или падает с ошибкой:
```typescript
const positive = Effect.succeed(-5).pipe(
  Effect.filterOrFail(
    n => n > 0,
    () => "Number must be positive"
  )
)
// Effect<number, string> - упадёт с ошибкой
```

### Обычный if-else с Effect
Можно использовать обычный JavaScript if:
```typescript
const result = (n: number) =>
  n > 0 
    ? Effect.succeed(n)
    : Effect.fail("negative")
```

## Задание

Реализуйте следующие функции в файле `exercise.ts`:

1. **conditionalEffect** - вернуть "positive" если n > 0, иначе "non-positive"
2. **logIfTrue** - залогировать сообщение только если condition true
3. **failUnless** - упасть с ошибкой если условие false
4. **filterPositive** - отфильтровать положительные числа или упасть
5. **complexConditional** - сложная условная логика с несколькими проверками

## Примеры

```typescript
import { Effect, Option } from "effect"

// Простой if-else
const check = (n: number) =>
  n > 0 
    ? Effect.succeed("positive")
    : Effect.succeed("non-positive")

// Effect.if с Effect условием
const dynamic = Effect.if(Effect.succeed(true), {
  onTrue: () => Effect.succeed("yes"),
  onFalse: () => Effect.succeed("no")
})

// Effect.when - условное выполнение
const maybeLog = Effect.when(true, () => 
  Effect.log("This will execute")
)
// Effect<Option<void>> - Some(void)

const noLog = Effect.when(false, () =>
  Effect.log("This won't execute")
)
// Effect<Option<void>> - None

// Effect.unless - обратное условие
const maybeError = Effect.unless(isValid, () =>
  Effect.fail("Invalid")
)

// filterOrFail
const onlyPositive = Effect.succeed(5).pipe(
  Effect.filterOrFail(
    n => n > 0,
    () => "Must be positive"
  )
)

// Сложная логика
const validate = (age: number) =>
  age < 0
    ? Effect.fail("negative")
    : age > 120
    ? Effect.fail("too old")
    : age < 18
    ? Effect.succeed("minor")
    : Effect.succeed("adult")
```

## Подсказки

- Простой if-else с Effect работает отлично
- `Effect.when` возвращает `Option` - используй `Effect.flatMap` если нужно развернуть
- `Effect.unless` это инверсия `Effect.when`
- `filterOrFail` полезен для валидации
- Можно комбинировать несколько условий через `Effect.gen`

## Бонус

Попробуйте:
- Создать switch-case паттерн через Effect
- Использовать `Effect.gen` для сложной условной логики
- Реализовать guard паттерн
- Создать валидатор с множественными условиями
