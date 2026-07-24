// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { DependencyContainer } from "./DependencyContainer.ts";

export function Injectable<T extends { new (): unknown }>(constructor: T) {
  DependencyContainer.instance.registerClass(constructor);
}
