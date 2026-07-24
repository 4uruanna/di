# @4uruanna/di

[![JSR](https://jsr.io/badges/@4uruanna/di?style=flat-square)](https://jsr.io/@4uruanna/di)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](LICENSE)
[![Deno](https://img.shields.io/badge/Deno->=2.0-000000?style=flat-square&logo=deno)](https://deno.land)

Lightweight Dependency Injection library for Deno with zero non-standard
dependency.

## Usage

### Basic Setup

Register your classes, primitives and functions with the `@Injectable` decorator
or `DependencyContainer.instance.register` and use `inject()` to retrieve them:

```typescript
import { inject, Injectable } from "@4uruanna/di";

@Injectable
class DatabaseService {
  connect() {
    return "Connected to database";
  }
}

@Injectable
class UserService {
  private db = inject(DatabaseService);

  getUsers() {
    return [
      { id: 1, name: "foo" },
    ];
  }
}

Dependency.instance.register("URL", "https://www.google.com/");

Dependency.instance.register("CB", () => 1);

// Use it

const userService = inject(UserService);
const url: string = inject("URL");
const callback: () => number = inject("CB");

console.log(
  userService.getUsers(), // [{ id: 1, name: "foo" }]
  url, // "https://www.google.com/"
  callback(), // 1
);
```

### Injection Types

This library supports three dependency lifetime types:

#### Singleton (Default)

Same instance is returned for all injection requests:

```typescript
@Injectable
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
@Injectable
class TransientService {
  id = Math.random();
}

const instance1 = inject(TransientService, "transient");
const instance2 = inject(TransientService, "transient");

console.log(instance1 === instance2); // false
```

#### Scope

Same instance within a named scope, different instances across scopes:

```typescript
import { DependencyContainer, inject, Injectable } from "@jackofblades/di";

@Injectable
class ScopedService {
  id = Math.random();
}

// Create instances in different scopes
const user1 = inject(ScopedService, "scoped", "1");
const user2 = inject(ScopedService, "scoped", "2");
const user1Again = inject(ScopedService, "scoped", "1");

console.log(user1 === user1Again); // true - same scope
console.log(user1 === user2); // false - different scopes

// Free a scope to release all its dependencies
DependencyContainer.instance.disposeScope("user-1");
DependencyContainer.instance.disposeScope("user-2");
```
