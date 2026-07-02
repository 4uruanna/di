# @4uruanna/di

[![JSR](https://jsr.io/badges/@4uruanna/di?style=flat-square)](https://jsr.io/@4uruanna/di)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](LICENSE)
[![Deno](https://img.shields.io/badge/Deno->=2.0-000000?style=flat-square&logo=deno)](https://deno.land)

A lightweight, type-safe dependency injection library for Deno and TypeScript
with zero non-standard dependency.

## Usage

### Basic Setup

Register your classes with the `@Injectable()` decorator and use `inject()` to
retrieve them:

```typescript
import { inject, Injectable } from "@jackofblades/di";

@Injectable()
class DatabaseService {
  connect() {
    return "Connected to database";
  }
}

@Injectable()
class UserService {
  private db = inject(DatabaseService);

  getUsers() {
    return this.db.connect();
  }
}

// Use it

const userService = inject(UserService);
console.log(userService.getUsers()); // "Connected to database"
```

### Injection Types

This library supports three dependency lifetime types:

#### Singleton (Default)

Same instance is returned for all injection requests:

```typescript
@Injectable()
class SingletonService {
  id = Math.random();
}

const instance1 = inject(SingletonService);
const instance2 = inject(SingletonService);

console.log(instance1 === instance2); // true
```

#### Transient

New instance is created for each injection request:

```typescript
@Injectable()
class TransientService {
  id = Math.random();
}

const instance1 = inject(TransientService, { type: "transient" });
const instance2 = inject(TransientService, { type: "transient" });

console.log(instance1 === instance2); // false
```

#### Scope

Same instance within a named scope, different instances across scopes:

```typescript
import { free, inject, Injectable } from "@jackofblades/di";

@Injectable()
class ScopedService {
  id = Math.random();
}

// Create instances in different scopes
const user1 = inject(ScopedService, { type: "scope", scope: "user-1" });
const user2 = inject(ScopedService, { type: "scope", scope: "user-2" });
const user1Again = inject(ScopedService, { type: "scope", scope: "user-1" });

console.log(user1 === user1Again); // true - same scope
console.log(user1 === user2); // false - different scopes

// Free a scope to release all its dependencies
free("user-1");
free("user-2");
```

### Constructor Arguments

Pass arguments to your dependencies at registration or injection time:

```typescript
@Injectable("global-arg")
class ConfigurableService {
  constructor(
    public globalArg: string,
    public optionalArg: string | null = null,
  ) {}
}

const service = inject(ConfigurableService, {
  type: "transient",
  args: ["optional-arg"],
});
```
