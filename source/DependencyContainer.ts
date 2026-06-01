// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import {
  type Constructor,
  type DependencyFactory,
  type DependencyToken,
  type Mode,
  TokenNotFoundError,
  UndefinedScopeError,
} from "@4uruanna/di";

/**
 * Container that manages dependency injection and lifecycle.
 * This is a singleton class that holds all registered dependencies and
 * manages their instantiation based on the specified mode (singleton, scoped, transient).
 */
export class DependencyContainer {
  /**
   * The singleton instance of the DependencyContainer.
   */
  private static _instance: DependencyContainer | null = null;

  /**
   * Gets the singleton instance of the DependencyContainer.
   * Creates a new instance if one does not already exist.
   * @returns The singleton DependencyContainer instance.
   */
  public static get instance(): DependencyContainer {
    if (this._instance === null) {
      this._instance = new DependencyContainer();
    }

    return this._instance;
  }

  /**
   * Map of registered dependency factories, keyed by their token.
   */
  private readonly beanMap = new Map<
    DependencyToken,
    DependencyFactory<unknown>
  >();

  /**
   * Map of singleton instances, keyed by their token.
   */
  private readonly singletonMap = new Map<DependencyToken, unknown>();

  /**
   * Map of scoped instances, keyed by scope name and then by token.
   */
  private readonly scopedMap = new Map<string, Map<DependencyToken, unknown>>();

  /**
   * Disposes all registered dependencies and clears all maps.
   * This releases all singleton and scoped instances.
   */
  public dispose() {
    this.beanMap.clear();
    this.singletonMap.clear();
    this.scopedMap.clear();
  }

  /**
   * Disposes all dependencies within a specific scope.
   * @param scope - The name of the scope to dispose.
   */
  public disposeScope(scope: string) {
    if (this.scopedMap.has(scope)) {
      this.scopedMap.delete(scope);
    }
  }

  /**
   * Registers a class constructor as a dependency.
   * The class will be instantiated when first requested.
   * @template T - The type of the class to register.
   * @param constructor - The class constructor to register.
   */
  public registerClass<T>(constructor: Constructor<T>) {
    this.beanMap.set(constructor, () => new constructor());
  }

  /**
   * Registers a dependency with a custom factory or value.
   * @template T - The type of the dependency to register.
   * @param token - The token to use for retrieving the dependency.
   * @param value - The value or factory function to register.
   */
  public register<T>(token: DependencyToken, value: T) {
    this.beanMap.set(token, () => value);
  }

  /**
   * Resolves a dependency by its token with the specified mode and scope.
   * @template T - The type of the dependency to resolve.
   * @param token - The token of the dependency to resolve.
   * @param mode - The injection mode (singleton, scoped, transient). Defaults to "singleton".
   * @param scope - The scope name for scoped dependencies. Required for "scoped" mode.
   * @returns The resolved dependency instance.
   * @throws {TokenNotFoundError} If the token is not registered.
   * @throws {UndefinedScopeError} If mode is "scoped" and scope is null.
   */
  public resolve<T>(
    token: Constructor<T>,
    mode?: Mode,
    scope?: string | null,
  ): T;

  public resolve<T>(
    token: string | symbol,
    mode?: Mode,
    scope?: string | null,
  ): T;

  public resolve<T>(
    token: DependencyToken,
    mode?: Mode,
    scope?: string | null,
  ): T;

  public resolve<T>(
    token: DependencyToken,
    mode: Mode = "singleton",
    scope: string | null = null,
  ): T {
    switch (mode) {
      case "singleton":
        return this.resolveSingleton<T>(token);

      case "scoped":
        return this.resolveScoped<T>(token, scope);

      case "transient":
        return this.resolveTransient(token);
    }
  }

  /**
   * Resolves a singleton dependency.
   * Creates and caches the instance on first request, returns cached instance on subsequent requests.
   * @template T - The type of the dependency to resolve.
   * @param token - The token of the dependency to resolve.
   * @returns The singleton instance.
   * @throws {TokenNotFoundError} If the token is not registered.
   */
  private resolveSingleton<T>(token: DependencyToken) {
    if (this.singletonMap.has(token) === false) {
      if (this.beanMap.has(token) === false) {
        throw new TokenNotFoundError(String(token));
      } else {
        this.singletonMap.set(
          token,
          this.beanMap.get(token)!(),
        );
      }
    }

    return this.singletonMap.get(token) as T;
  }

  /**
   * Resolves a scoped dependency.
   * Creates and caches the instance per scope on first request within that scope.
   * @template T - The type of the dependency to resolve.
   * @param token - The token of the dependency to resolve.
   * @param scope - The scope name for the dependency.
   * @returns The scoped instance.
   * @throws {UndefinedScopeError} If scope is null.
   * @throws {TokenNotFoundError} If the token is not registered.
   */
  private resolveScoped<T>(token: DependencyToken, scope: string | null) {
    if (scope === null) {
      throw new UndefinedScopeError(String(token));
    }

    if (this.scopedMap.has(scope) === false) {
      this.scopedMap.set(scope, new Map());
    }

    const scopeMap = this.scopedMap.get(scope)!;

    if (scopeMap.has(token) === false) {
      if (this.beanMap.has(token) === false) {
        throw new TokenNotFoundError(String(token));
      } else {
        scopeMap.set(
          token,
          this.beanMap.get(token)!(),
        );
      }
    }

    return scopeMap.get(token) as T;
  }

  /**
   * Resolves a transient dependency.
   * Creates a new instance on each request.
   * @template T - The type of the dependency to resolve.
   * @param token - The token of the dependency to resolve.
   * @returns A new instance of the dependency.
   * @throws {TokenNotFoundError} If the token is not registered.
   */
  private resolveTransient<T>(token: DependencyToken) {
    if (this.beanMap.has(token) === false) {
      throw new TokenNotFoundError(String(token));
    } else {
      return this.beanMap.get(token)!() as T;
    }
  }
}
