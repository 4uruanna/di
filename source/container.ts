// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import {
  type Dependency,
  type Factory,
  type InjectionOptions,
  MissingFactoryError,
  MissingScopeError,
  type UnknownDependency,
  type UnknownDependencyFactory,
  type UnknownFactory,
} from "./mod.ts";

/**
 * A dependency injection container that manages instance creation and lifecycle.
 * Supports 'singleton', 'scope' and 'transient'.
 */
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
    Map<UnknownFactory, UnknownDependency>
  >();

  /**
   * Retrieves a dependency instance based on the provided injection options.
   *
   * @template T - The dependency type to retrieve.
   * @param {Factory<T>} factory - The constructor function for the factory.
   * @param {InjectionOptions} options - The injection options containing type, args, and scope.
   * @returns {Dependency<T>} The resolved dependency instance.
   * @throws {MissingFactoryError} If factory is missing.
   * @throws {MissingScopeError} If scope is missing for scope-type injection.
   */
  public get<T>(
    constructor: Factory<T>,
    options: InjectionOptions,
  ): Dependency<T> {
    switch (options.type) {
      case "singleton":
        return this._getSingleton(constructor, options);
      case "scope":
        return this._getScope(constructor, options);
      case "transient":
        return this._getTransient(constructor, options);
    }
  }

  /**
   * Registers a dependency factory with optional pre-bound arguments.
   *
   * @template T - The constructor type extending UnknownFactory.
   * @param {T} constructor - The constructor function to register.
   * @param {...unknown[]} args - Optional arguments to pre-bind to the constructor.
   * @returns {void}
   */
  public set<T extends UnknownFactory>(constructor: T, ...args: unknown[]): void {
    const bound = constructor.bind(null, ...args);

    this._factoryMap.set(
      constructor,
      (...args: unknown[]) => new bound(...args),
    );
  }

  /**
   * Releases all or a specific cached instances.
   *
   * @param {string|undefined} key - The scope key to free.
   * @returns {void}
   */
  public free(key?: string): void {
    if(key) {
      if (this._scopeMap.has(key)) {
        this._scopeMap.delete(key);
      }
    } else {
      this._scopeMap.clear();
    }
  }

  /**
   * Retrieves the registered factory function for a dependency.
   *
   * @template T - The dependency type.
   * @param {Factory<T>} factory - The constructor function to look up.
   * @returns {UnknownDependencyFactory} The factory function for creating instances.
   * @throws {MissingFactoryError} If no factory is registered for the dependency.
   * @private
   */
  private _getFactory<T>(constructor: Factory<T>) {
    if (this._factoryMap.has(constructor)) {
      const factory = this._factoryMap.get(constructor)!;
      return factory as (
        ...args: unknown[]
      ) => InstanceType<Factory<T>>;
    } else {
      throw new MissingFactoryError(constructor);
    }
  }

  /**
   * Retrieves a "singleton" dependency instance.
   *
   * @template T - The dependency type to retrieve.
   * @param {Factory<T>} factory - The constructor function for the factory.
   * @param {InjectionOptions} options - The injection options containing args.
   * @returns {Dependency<T>} The resolved dependency instance.
   * @throws {MissingFactoryError} If factory is missing.
   * @private
   */
  private _getSingleton<T>(
    constructor: Factory<T>,
    options: InjectionOptions,
  ): Dependency<T> {
    if (this._singletonMap.has(constructor) === false) {
      const factory = this._getFactory(constructor);
      this._singletonMap.set(constructor, factory(...(options.args || [])));
    }

    return this._singletonMap.get(constructor) as Dependency<T>;
  }

  /**
   * Retrieves a "scope" dependency instance.
   *
   * @template T - The dependency type to retrieve.
   * @param {Factory<T>} factory - The constructor function for the factory.
   * @param {InjectionOptions} options - The injection options containing args and scope.
   * @returns {Dependency<T>} The resolved dependency instance.
   * @throws {MissingFactoryError} If factory is missing.
   * @throws {MissingScopeError} If scope is missing for scope-type injection.
   * @private
   */
  private _getScope<T>(
    constructor: Factory<T>,
    options: InjectionOptions,
  ): Dependency<T> {
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

      if (map.has(constructor) === false) {
        const factory = this._getFactory(constructor);
        map.set(constructor, factory(...(options.args || [])));
      }

      return map.get(constructor) as Dependency<T>;
    } else {
      throw new MissingScopeError();
    }
  }

  /**
   * Retrieves a "transient" dependency instance.
   *
   * @template T - The dependency type to retrieve.
   * @param {Factory<T>} factory - The constructor function for the factory.
   * @param {InjectionOptions} options - The injection options containing args.
   * @returns {Dependency<T>} The resolved dependency instance.
   * @throws {MissingFactoryError} If factory is missing.
   * @private
   */
  private _getTransient<T>(
    constructor: Factory<T>,
    options: InjectionOptions,
  ): Dependency<T> {
    return this._getFactory(constructor)(...(options.args || []));
  }
}

/**
 * The default global dependency injection container instance.
 */
export const container: DependencyContainer = new DependencyContainer();
