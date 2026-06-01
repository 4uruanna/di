// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container } from "./mod.ts";

export function free(scope: string): void {
  container.free(scope);
}
