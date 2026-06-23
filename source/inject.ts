// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container, type Factory, type InjectionOptions } from "./mod.ts";

/**
 * Retrieves or constructs a dependency instance using the global container.
 *
 * @template T - The dependency type to retrieve.
 * @param {Factory<T>} factory - The constructor function for the dependency.
 * @param {InjectionOptions} options - The injection options (defaults to singleton).
 * @returns {T} The resolved dependency instance.
 */
export function inject<T>(
  factory: Factory<T>,
  options: InjectionOptions = {
    type: "singleton",
    args: [],
  },
): T {
  return container.get(factory, options) as T;
}
