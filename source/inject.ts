// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { container, type Factory, type InjectionOptions } from "./mod.ts";

export function inject<T>(
  dependency: Factory<T>,
  options: InjectionOptions = {
    type: "singleton",
    args: [],
  },
): T {
  return container.get(dependency, options) as T;
}
