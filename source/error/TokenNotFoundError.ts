// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

/**
 * Error thrown when a dependency token is not found in the container.
 */
export class TokenNotFoundError extends Error {
  /**
   * Creates a new TokenNotFoundError.
   * @param token - The token that was not found in the container.
   */
  constructor(token: string) {
    super(`No bean for ${token}`);
  }
}
