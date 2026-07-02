// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

export class TokenNotFoundError extends Error {
  constructor(token: string) {
    super(`No bean for ${token}`);
  }
}
