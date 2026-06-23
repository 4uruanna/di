// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

/**
 * A generic class constructor type.
 *
 * @template T - The type of instance created by the factory.
 */
export type Factory<T> = new (
  // deno-lint-ignore no-explicit-any
  ...args: ConstructorParameters<new (...args: any[]) => T>
) => T;

/**
 * A factory that returns an instance of an unknown type.
 */
export type UnknownFactory = Factory<unknown>;

/**
 * The instance type produced by a factory.
 *
 * @template T - The type of instance.
 */
export type Dependency<T> = InstanceType<Factory<T>>;

/**
 * A dependency of an unknown type.
 */
export type UnknownDependency = Dependency<unknown>;

/**
 * A factory function that creates a dependency of an unknown type.
 */
export type UnknownDependencyFactory = (
  ...args: unknown[]
) => UnknownDependency;
