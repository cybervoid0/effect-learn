# Effect Learning Exercises

Полный список упражнений для изучения Effect от базовых концепций до продвинутых паттернов.

## Как использовать

1. Начните с Level 1 и двигайтесь последовательно
2. Читайте `README.md` в каждом задании для понимания концепции
3. Реализуйте функции в `exercise.ts`
4. Запустите тесты: `npm run test:exercise [path]`
5. Сравните с `solution.ts` если застряли

## Прогресс

Отмечайте выполненные задания:

## Level 1: Basics (3 задания)

Изучите основы создания, запуска и трансформации Effects.

- [ ] **01-creating-effects** - Создание Effects с помощью succeed, fail, sync, promise
- [ ] **02-running-effects** - Запуск Effects с помощью runSync, runPromise, runFork
- [ ] **03-transforming-effects** - Трансформация Effects с помощью map, flatMap, andThen

## Level 2: Error Handling (3 задания)

Научитесь работать с ошибками в Effect.

- [ ] **01-expected-errors** - Типизированные ошибки через Effect.fail
- [ ] **02-catching-errors** - Обработка ошибок через catchAll, catchTag, catchSome
- [ ] **03-fallback-strategies** - Fallback стратегии через orElse, retry, timeout

## Level 3: Control Flow (3 задания)

Управление потоком выполнения в Effect.

- [ ] **01-conditional-logic** - Условная логика через Effect.if, when, unless
- [ ] **02-looping** - Циклы через Effect.loop, iterate, forEach
- [ ] **03-combining-effects** - Комбинирование через Effect.all, zip, struct

## Level 4: Concurrency (3 задания)

Основы конкурентности и работы с Fibers.

- [ ] **01-fibers-basics** - Работа с Fiber через fork, join, await, interrupt
- [ ] **02-racing-effects** - Racing через Effect.race, raceAll
- [ ] **03-parallel-execution** - Параллельное выполнение с concurrency

## Level 5: Resource Management (2 задания)

Безопасное управление ресурсами.

- [ ] **01-scope-basics** - Scope и автоматическая очистка через acquireRelease
- [ ] **02-acquire-release** - Сложные паттерны управления ресурсами

## Level 6: Services (3 задания)

Dependency Injection в Effect.

- [ ] **01-defining-services** - Определение сервисов через Context.Tag
- [ ] **02-using-services** - Использование сервисов через Effect.service
- [ ] **03-layers** - Композиция сервисов через Layer

## Level 7: State Management (3 задания)

Управление состоянием в Effect.

- [ ] **01-ref-basics** - Мутабельное состояние через Ref
- [ ] **02-synchronized-ref** - Атомарные операции через SynchronizedRef
- [ ] **03-subscription-ref** - Реактивное состояние через SubscriptionRef

## Level 8: Advanced Concurrency (4 задания)

Продвинутые примитивы конкурентности.

- [ ] **01-deferred** - Синхронизация через Deferred
- [ ] **02-queue** - Очереди через Queue
- [ ] **03-pubsub** - Pub-Sub через PubSub
- [ ] **04-semaphore** - Ограничение конкурентности через Semaphore

## Level 9: Streams (4 задания)

Обработка потоков данных.

- [ ] **01-stream-basics** - Создание и потребление Stream
- [ ] **02-stream-transformations** - Трансформация Stream
- [ ] **03-stream-combining** - Комбинирование Stream
- [ ] **04-stream-error-handling** - Обработка ошибок в Stream

## Level 10: Sink (2 задания)

Потребление данных из Stream.

- [ ] **01-sink-basics** - Базовое использование Sink
- [ ] **02-sink-composition** - Композиция Sink

## Level 11: Scheduling & Caching (3 задания)

Планирование и кэширование.

- [ ] **01-schedule-basics** - Планирование через Schedule
- [ ] **02-caching-effects** - Кэширование через Effect.cached
- [ ] **03-cache-advanced** - Продвинутое кэширование через Cache

## Level 12: Batching & Requests (2 задания)

Батчинг запросов для оптимизации.

- [ ] **01-batching-basics** - Батчинг через Request и RequestResolver
- [ ] **02-batching-advanced** - Продвинутый батчинг и DataLoader паттерн

## Level 13: Observability (3 задания)

Логирование, метрики и трейсинг.

- [ ] **01-logging** - Логирование через встроенный Logger
- [ ] **02-metrics** - Метрики через Metric
- [ ] **03-tracing** - Трейсинг через Tracer

## Level 14: Configuration & Runtime (3 задания)

Конфигурация и кастомные runtime.

- [ ] **01-configuration** - Конфигурация через Config
- [ ] **02-config-provider** - Кастомный ConfigProvider
- [ ] **03-runtime-custom** - Кастомный Runtime

## Level 15: Advanced Patterns (3 задания)

Продвинутые паттерны использования Effect.

- [ ] **01-interruption** - Прерывание и graceful shutdown
- [ ] **02-supervisor** - Надзор за Fiber через Supervisor
- [ ] **03-effect-gen-advanced** - Продвинутое использование Effect.gen

---

**Всего: 47 заданий**

## Дополнительные ресурсы

- [Effect Documentation](https://effect.website/docs/)
- [Effect Discord](https://discord.gg/effect-ts)
- [Effect GitHub](https://github.com/Effect-TS/effect)

## Советы

- Не спешите, изучайте концепции последовательно
- Экспериментируйте с кодом
- Читайте документацию Effect
- Задавайте вопросы в Discord сообществе
- Сравнивайте свое решение с эталонным
