// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

export interface InjectionOptions {
  type: "singleton" | "scope" | "transient";
  args?: unknown[];
  scope?: string;
}
