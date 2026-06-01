// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import type {
  Dependency,
  Factory,
  InjectionOptions,
  UnknownDependency,
  UnknownDependencyFactory,
  UnknownFactory,
} from "./mod.ts";

export class DependencyContainer {
  private readonly _factoryMap = new Map<
    UnknownFactory,
    UnknownDependencyFactory
  >();

  private readonly _singletonMap = new Map<
    UnknownFactory,
    UnknownDependency
  >();

  private readonly _scopeMap = new Map<
    string,
    Map<
      UnknownFactory,
      UnknownDependency
    >
  >();

  public get<T>(
    dependency: Factory<T>,
    options: InjectionOptions,
  ): Dependency<T> {
    if (options.type === "singleton") {
      if (this._singletonMap.has(dependency) === false) {
        const factory = this._getFactory(dependency);
        this._singletonMap.set(dependency, factory(...(options.args || [])));
      }

      return this._singletonMap.get(dependency) as T;
    } else if (options.type === "scope") {
      if (options.scope) {
        if (this._scopeMap.has(options.scope) === false) {
          this._scopeMap.set(
            options.scope,
            new Map<
              UnknownFactory,
              UnknownDependency
            >(),
          );
        }

        const map = this._scopeMap.get(options.scope)!;

        if (map.has(dependency) === false) {
          const factory = this._getFactory(dependency);
          map.set(dependency, factory(...(options.args || [])));
        }

        return map.get(dependency) as T;
      } else {
        // THROW MISSING SCOPE ERROR
        throw new Error();
      }
    } else {
      const factory = this._getFactory(dependency);
      return factory(...(options.args || []));
    }
  }

  public set<T extends UnknownFactory>(constructor: T, ...args: unknown[]) {
    const bound = constructor.bind(null, ...args);

    this._factoryMap.set(
      constructor,
      (...args: unknown[]) => new bound(...args),
    );
  }

  public free(scope: string) {
    if (this._scopeMap.has(scope)) {
      this._scopeMap.delete(scope);
    }
  }

  private _getFactory<T>(dependency: Factory<T>) {
    if (this._factoryMap.has(dependency)) {
      const factory = this._factoryMap.get(dependency)!;
      return factory as (
        ...args: unknown[]
      ) => InstanceType<Factory<T>>;
    } else {
      // THROW MISSING FACTORY ERROR
      throw new Error();
    }
  }
}

export const container: DependencyContainer = new DependencyContainer();
