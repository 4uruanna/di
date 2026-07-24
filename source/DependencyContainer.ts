// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import {
  type Constructor,
  type DependencyFactory,
  type DependencyToken,
  type Mode,
  TokenNotFoundError,
  UndefinedScopeError,
} from "@4uruanna/di";

export class DependencyContainer {
  private static _instance: DependencyContainer | null = null;

  public static get instance(): DependencyContainer {
    if (this._instance === null) {
      this._instance = new DependencyContainer();
    }

    return this._instance;
  }

  private readonly beanMap = new Map<
    DependencyToken,
    DependencyFactory<unknown>
  >();

  private readonly singletonMap = new Map<DependencyToken, unknown>();

  private readonly scopedMap = new Map<string, Map<DependencyToken, unknown>>();

  public dispose() {
    this.beanMap.clear();
    this.singletonMap.clear();
    this.scopedMap.clear();
  }

  public disposeScope(scope: string) {
    if (this.scopedMap.has(scope)) {
      this.scopedMap.delete(scope);
    }
  }

  public registerClass<T>(constructor: Constructor<T>) {
    this.beanMap.set(constructor, () => new constructor());
  }

  public register<T>(token: DependencyToken, value: T) {
    this.beanMap.set(token, () => value);
  }

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

  private resolveTransient<T>(token: DependencyToken) {
    if (this.beanMap.has(token) === false) {
      throw new TokenNotFoundError(String(token));
    } else {
      return this.beanMap.get(token)!() as T;
    }
  }
}
