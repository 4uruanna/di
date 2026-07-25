# @4uruanna/di

[![JSR](https://jsr.io/badges/@4uruanna/di?style=flat-square)](https://jsr.io/@4uruanna/di)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](LICENSE)
[![Deno](https://img.shields.io/badge/Deno->=2.0-000000?style=flat-square&logo=deno)](https://deno.land)

Lightweight Dependency Injection library for Deno with zero non-standard
dependency.

## Features

- **Zero Dependencies**: No external dependencies required
- **Type-Safe**: Full TypeScript support with proper type inference
- **Multiple Lifetimes**: Support for singleton, scoped, and transient
  dependencies
- **Simple API**: Easy to use with decorators and a clean injection function
- **Flexible Tokens**: Use classes, strings, or symbols as dependency tokens

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

// Register primitives and functions
DependencyContainer.instance.register("URL", "https://www.google.com/");
DependencyContainer.instance.register("CB", () => 1);

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

Same instance is returned for all injection requests. This is the default mode.

```typescript
import { inject, Injectable } from "@4uruanna/di";

@Injectable
class SingletonService {
  id = Math.random();
}

const instance1 = inject(SingletonService);
const instance2 = inject(SingletonService);

console.log(instance1 === instance2); // true
console.log(instance1.id === instance2.id); // true
```

**Use case**: Global services like configuration, database connections, or
logging services that should have a single instance throughout the application.

#### Transient

New instance is created for each injection request.

```typescript
import { inject, Injectable } from "@4uruanna/di";

@Injectable
class TransientService {
  id = Math.random();
}

const instance1 = inject(TransientService, "transient");
const instance2 = inject(TransientService, "transient");

console.log(instance1 === instance2); // false
console.log(instance1.id === instance2.id); // false (different random values)
```

**Use case**: Stateless services or objects where you want a fresh instance each
time, like request handlers or data transfer objects.

#### Scoped

Same instance within a named scope, different instances across scopes.

```typescript
import { DependencyContainer, inject, Injectable } from "@4uruanna/di";

@Injectable
class ScopedService {
  id = Math.random();
}

// Create instances in different scopes
const user1 = inject(ScopedService, "scoped", "user-session-1");
const user2 = inject(ScopedService, "scoped", "user-session-2");
const user1Again = inject(ScopedService, "scoped", "user-session-1");

console.log(user1 === user1Again); // true - same scope
console.log(user1 === user2); // false - different scopes

// Free a scope to release all its dependencies
DependencyContainer.instance.disposeScope("user-session-1");
DependencyContainer.instance.disposeScope("user-session-2");
```

**Use case**: User sessions, request contexts, or any scenario where you want
shared instances within a specific context but isolated across different
contexts.

### Advanced Usage

#### Manual Registration

You can manually register dependencies without using the `@Injectable`
decorator:

```typescript
import { DependencyContainer, inject } from "@4uruanna/di";

class MyService {
  constructor(private config: string) {}

  doSomething() {
    return this.config;
  }
}

// Register with a factory function
DependencyContainer.instance.register(
  MyService,
  () => new MyService("production"),
);

// Or register a pre-created instance
const myService = new MyService("test");
DependencyContainer.instance.register(MyService, myService);

// Retrieve the dependency
const service = inject(MyService);
console.log(service.doSomething());
```

#### Using String and Symbol Tokens

Dependencies can be registered and retrieved using string or symbol tokens:

```typescript
import { DependencyContainer, inject } from "@4uruanna/di";

// String token
const API_URL = "API_URL";
DependencyContainer.instance.register(API_URL, "https://api.example.com");

const url = inject<string>(API_URL);
console.log(url); // "https://api.example.com"

// Symbol token
const API_KEY = Symbol("API_KEY");
DependencyContainer.instance.register(API_KEY, "secret-key-123");

const key = inject<string>(API_KEY);
console.log(key); // "secret-key-123"
```

#### Cleanup

To clean up all registered dependencies:

```typescript
import { DependencyContainer } from "@4uruanna/di";

// Dispose all dependencies
DependencyContainer.instance.dispose();

// Or dispose a specific scope
DependencyContainer.instance.disposeScope("my-scope");
```

### Error Handling

The library throws specific errors for common issues:

```typescript
import { inject, TokenNotFoundError, UndefinedScopeError } from "@4uruanna/di";

try {
  // Trying to inject an unregistered dependency
  const unregistered = inject("NonExistentToken");
} catch (error) {
  if (error instanceof TokenNotFoundError) {
    console.error(`Token not found: ${error.message}`);
  }
}

try {
  // Trying to use scoped mode without providing a scope
  const scoped = inject(MyService, "scoped");
} catch (error) {
  if (error instanceof UndefinedScopeError) {
    console.error(`Scope is required: ${error.message}`);
  }
}
```

## Examples

### Real-world Example: HTTP Server with DI

```typescript
import { inject, Injectable } from "@4uruanna/di";

// Configuration service
@Injectable
class ConfigService {
  get port() {
    return 8000;
  }
}

// Database service
@Injectable
class DatabaseService {
  private config = inject(ConfigService);

  connect() {
    console.log(`Connecting to database on port ${this.config.port}`);
  }
}

// User repository
@Injectable
class UserRepository {
  private db = inject(DatabaseService);

  async findAll() {
    return [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
  }
}

// User controller
@Injectable
class UserController {
  private userRepo = inject(UserRepository);

  async getUsers() {
    return await this.userRepo.findAll();
  }
}

// Initialize and use
const controller = inject(UserController);
const users = await controller.getUsers();
console.log(users);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.
