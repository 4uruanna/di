// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { DependencyContainer } from "./DependencyContainer.ts";
import type { Constructor, DependencyToken, Mode } from "./types.ts";

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
