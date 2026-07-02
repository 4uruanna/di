// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container } from "./mod.ts";

/**
 * Releases all cached instances for a specific scope in the global container.
 *
 * @param {string} scope - The name of the key to free.
 * @returns {void}
 */
export function free(key?: string): void {
  container.free(key);
}
