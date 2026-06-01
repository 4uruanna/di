// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import {
  type Constructor,
  DependencyContainer,
  type DependencyToken,
  type Mode,
} from "@4uruanna/di";

/**
 * Retrieves a dependency from the container.
 * This is the main function used to inject dependencies into your code.
 *
 * @template T - The type of the dependency to inject.
 * @param token - The token identifying the dependency (class, string, or symbol).
 * @param mode - The injection mode (singleton, scoped, transient). Defaults to "singleton".
 * @param scope - The scope name for scoped dependencies. Required when mode is "scoped".
 * @returns The dependency instance.
 * @throws {TokenNotFoundError} If the token is not registered in the container.
 * @throws {UndefinedScopeError} If mode is "scoped" and scope is null or undefined.
 *
 * @example
 * ```typescript
 * // Inject a singleton service
 * const service = inject(MyService);
 *
 * // Inject a transient instance
 * const transient = inject(MyService, "transient");
 *
 * // Inject a scoped instance
 * const scoped = inject(MyService, "scoped", "user-session");
 * ```
 */
export function inject<T>(
  token: Constructor<T>,
  mode?: Mode,
  scope?: string | null,
): T;

export function inject<T>(
  token: symbol | string,
  mode?: Mode,
  scope?: string | null,
): T;

export function inject<T>(
  token: DependencyToken,
  mode?: Mode,
  scope?: string | null,
): T;

export function inject<T>(
  token: DependencyToken,
  mode?: Mode,
  scope?: string | null,
): T {
  return DependencyContainer.instance.resolve<T>(
    token,
    mode,
    scope,
  );
}
