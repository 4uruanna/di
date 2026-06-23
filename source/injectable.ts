// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container, type UnknownFactory } from "./mod.ts";

/**
 * A decorator function that registers a class constructor with the global container.
 *
 * @param {...unknown[]} args - Optional arguments to pre-bind to the constructor when creating instances.
 * @returns {function} A decorator function that registers the constructor.
 *
 * @example
 * ```typescript
 * @Injectable(
 *   "prebind foo value",
 *   "prebind bar value"
 * )
 * class MyService {
 *   constructor(
 *     foo: string,
 *     bar: string
 *   ) {}
 * }
 *
 * const service = inject(MyService);
 * ```
 */
export function Injectable(
  ...args: unknown[]
): <T extends UnknownFactory>(constructor: T) => void {
  return <T extends UnknownFactory>(constructor: T): void => {
    container.set(constructor, ...args);
  };
}
