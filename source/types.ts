// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

/**
 * Constructor type for a class that can be instantiated with any arguments.
 * @template T - The type of the instance created by the constructor.
 */
export type Constructor<T> = { new (...args: any[]): T };

/**
 * Dependency injection mode that determines the lifetime of the dependency.
 * - "singleton": Same instance is returned for all injection requests.
 * - "scoped": Same instance within a named scope, different instances across scopes.
 * - "transient": New instance is created for each injection request.
 */
export type Mode = "singleton" | "scoped" | "transient";

/**
 * Token type used to identify dependencies in the container.
 * Can be a constructor, a string, or a symbol.
 */
export type DependencyToken =
  | Constructor<unknown>
  | string
  | symbol;

/**
 * Factory function type that creates a dependency instance.
 * @template T - The type of the dependency to create.
 */
export type DependencyFactory<T> = () => T;
