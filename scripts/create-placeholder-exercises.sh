#!/bin/bash

# Script to create placeholder files for all exercises

EXERCISES_DIR="exercises"

# Function to create placeholder files for an exercise
create_exercise_files() {
    local level=$1
    local exercise=$2
    local title=$3
    
    local exercise_path="$EXERCISES_DIR/$level/$exercise"
    
    # Skip if README already exists
    if [ -f "$exercise_path/README.md" ]; then
        echo "Skipping $exercise (already exists)"
        return
    fi
    
    # Create README.md
    cat > "$exercise_path/README.md" << EOF
# $title

## Концепция

TODO: Добавить описание концепции

## Задание

Реализуйте функции в файле \`exercise.ts\`.

## Примеры

\`\`\`typescript
import { Effect } from "effect"

// TODO: Добавить примеры
\`\`\`

## Подсказки

- Используйте документацию Effect: https://effect.website/docs/

## Бонус

TODO: Добавить бонусные задания
EOF

    # Create exercise.ts
    cat > "$exercise_path/exercise.ts" << EOF
import { Effect } from "effect"

/**
 * TODO: Implement the exercise functions
 */

export const solution = Effect.succeed("TODO: Implement me!")
EOF

    # Create solution.ts
    cat > "$exercise_path/solution.ts" << EOF
import { Effect } from "effect"

/**
 * Solution implementation
 */

export const solution = Effect.succeed("Implemented!")
EOF

    # Create exercise.test.ts
    cat > "$exercise_path/exercise.test.ts" << EOF
import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"
import * as Exercise from "./exercise"

describe("$exercise", () => {
\tit("should work correctly", () => {
\t\tconst result = Effect.runSync(Exercise.solution)
\t\texpect(result).toBeDefined()
\t})
})
EOF

    echo "✓ Created $exercise"
}

# Level 2: Error Handling
create_exercise_files "02-error-handling" "01-expected-errors" "Expected Errors"
create_exercise_files "02-error-handling" "02-catching-errors" "Catching Errors"
create_exercise_files "02-error-handling" "03-fallback-strategies" "Fallback Strategies"

# Level 3: Control Flow
create_exercise_files "03-control-flow" "01-conditional-logic" "Conditional Logic"
create_exercise_files "03-control-flow" "02-looping" "Looping"
create_exercise_files "03-control-flow" "03-combining-effects" "Combining Effects"

# Level 4: Concurrency
create_exercise_files "04-concurrency" "01-fibers-basics" "Fibers Basics"
create_exercise_files "04-concurrency" "02-racing-effects" "Racing Effects"
create_exercise_files "04-concurrency" "03-parallel-execution" "Parallel Execution"

# Level 5: Resource Management
create_exercise_files "05-resource-management" "01-scope-basics" "Scope Basics"
create_exercise_files "05-resource-management" "02-acquire-release" "Acquire Release"

# Level 6: Services
create_exercise_files "06-services" "01-defining-services" "Defining Services"
create_exercise_files "06-services" "02-using-services" "Using Services"
create_exercise_files "06-services" "03-layers" "Layers"

# Level 7: State Management
create_exercise_files "07-state-management" "01-ref-basics" "Ref Basics"
create_exercise_files "07-state-management" "02-synchronized-ref" "Synchronized Ref"
create_exercise_files "07-state-management" "03-subscription-ref" "Subscription Ref"

# Level 8: Advanced Concurrency
create_exercise_files "08-advanced-concurrency" "01-deferred" "Deferred"
create_exercise_files "08-advanced-concurrency" "02-queue" "Queue"
create_exercise_files "08-advanced-concurrency" "03-pubsub" "PubSub"
create_exercise_files "08-advanced-concurrency" "04-semaphore" "Semaphore"

# Level 9: Streams
create_exercise_files "09-streams" "01-stream-basics" "Stream Basics"
create_exercise_files "09-streams" "02-stream-transformations" "Stream Transformations"
create_exercise_files "09-streams" "03-stream-combining" "Stream Combining"
create_exercise_files "09-streams" "04-stream-error-handling" "Stream Error Handling"

# Level 10: Sink
create_exercise_files "10-sink" "01-sink-basics" "Sink Basics"
create_exercise_files "10-sink" "02-sink-composition" "Sink Composition"

# Level 11: Scheduling & Caching
create_exercise_files "11-scheduling-caching" "01-schedule-basics" "Schedule Basics"
create_exercise_files "11-scheduling-caching" "02-caching-effects" "Caching Effects"
create_exercise_files "11-scheduling-caching" "03-cache-advanced" "Cache Advanced"

# Level 12: Batching & Requests
create_exercise_files "12-batching-requests" "01-batching-basics" "Batching Basics"
create_exercise_files "12-batching-requests" "02-batching-advanced" "Batching Advanced"

# Level 13: Observability
create_exercise_files "13-observability" "01-logging" "Logging"
create_exercise_files "13-observability" "02-metrics" "Metrics"
create_exercise_files "13-observability" "03-tracing" "Tracing"

# Level 14: Configuration & Runtime
create_exercise_files "14-configuration-runtime" "01-configuration" "Configuration"
create_exercise_files "14-configuration-runtime" "02-config-provider" "Config Provider"
create_exercise_files "14-configuration-runtime" "03-runtime-custom" "Runtime Custom"

# Level 15: Advanced Patterns
create_exercise_files "15-advanced-patterns" "01-interruption" "Interruption"
create_exercise_files "15-advanced-patterns" "02-supervisor" "Supervisor"
create_exercise_files "15-advanced-patterns" "03-effect-gen-advanced" "Effect Gen Advanced"

echo ""
echo "✨ All placeholder exercises created!"
echo "📝 You can now start filling in the details for each exercise."
