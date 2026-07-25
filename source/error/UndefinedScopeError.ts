// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

/**
 * Error thrown when a scoped dependency is requested without providing a scope.
 */
export class UndefinedScopeError extends Error {
  /**
   * Creates a new UndefinedScopeError.
   * @param token - The token for which the scope was undefined.
   */
  constructor(token: string) {
    super(`No scope given for ${token}`);
  }
}
