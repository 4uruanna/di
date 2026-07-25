// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { DependencyContainer } from "@4uruanna/di";

/**
 * Decorator that registers a class as injectable in the dependency container.
 * The class will be automatically registered with the container and can be
 * retrieved using the `inject()` function.
 *
 * @template T - The class constructor type that extends a class constructor.
 * @param constructor - The class constructor to register.
 * @returns The original constructor (identity function for decorator usage).
 *
 * @example
 * ```typescript
 * @Injectable
 * class MyService {
 *   doSomething() {
 *     return "Hello";
 *   }
 * }
 *
 * const service = inject(MyService);
 * console.log(service.doSomething()); // "Hello"
 * ```
 */
export function Injectable<T extends { new (): unknown }>(constructor: T) {
  DependencyContainer.instance.registerClass(constructor);
  return constructor;
}
