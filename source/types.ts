// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

export type Factory<T> = new (
  // deno-lint-ignore no-explicit-any
  ...args: ConstructorParameters<new (...args: any[]) => T>
) => T;

export type UnknownFactory = Factory<unknown>;

export type Dependency<T> = InstanceType<Factory<T>>;

export type UnknownDependency = Dependency<unknown>;

export type UnknownDependencyFactory = (...args: unknown[]) => UnknownDependency;
