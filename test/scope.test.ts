// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { expect } from "@std/expect";
import { free, inject, Injectable, MissingScopeError } from "../source/mod.ts";

@Injectable("oof")
class FooClass {
  public constructor(public arg: string, public scope: string) {}
}

Deno.test("inject scope", () => {
  const foo = inject(FooClass, { type: "scope", scope: "foo", args: ["foo"] });
  const copy = inject(FooClass, { type: "scope", scope: "foo", args: ["foo"] });

  const bar = inject(FooClass, { type: "scope", scope: "bar", args: ["bar"] });

  expect(foo === copy).toBe(true);
  expect(foo.scope).toBe("foo");
  expect(foo.arg).toBe("oof");

  expect(bar === foo).toBe(false);
  expect(bar.scope).toBe("bar");

  free("bar");
  const another = inject(FooClass, {
    type: "scope",
    scope: "bar",
    args: ["bar"],
  });
  expect(bar === another).toBe(false);
});

Deno.test("inject scope without scope name throws error", () => {
  expect(() => inject(FooClass, { type: "scope" })).toThrow(MissingScopeError);
});
