// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container, type UnknownFactory } from "./mod.ts";

export function Injectable(...args: unknown[]): <T extends UnknownFactory>(constructor: T) => void {
  return <T extends UnknownFactory>(constructor: T): void => {
    container.set(constructor, ...args);
  };
}
