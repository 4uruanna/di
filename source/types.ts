// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

export type Factory<T> = new (
  ...args: ConstructorParameters<new (...args: unknown[]) => T>
) => T;

export type UnknownFactory = Factory<unknown>;

export type Dependency<T> = InstanceType<Factory<T>>;

export type UnknownDependency = Dependency<unknown>;

export type UnknownDependencyFactory = (...args: unknown[]) => UnknownDependency;
