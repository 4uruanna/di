// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { expect } from "@std/expect";
import { inject, Injectable } from "../source/mod.ts";
import { assertEquals } from "@std/assert/equals";

@Injectable("oof")
class FooClass {
  public constructor(public arg: string) {}

  val() {
    return "foo";
  }
}

@Injectable()
class BarClass {
  public foo = inject(FooClass);

  val() {
    return "bar";
  }
}

@Injectable()
class BazClass {
  public constructor() {}

  public bar = inject(BarClass);

  val() {
    return "baz";
  }
}

class BeeClass {
}

Deno.test("inject singleton", () => {
  const baz = inject(BazClass);

  assertEquals(baz.val(), "baz");
  assertEquals(baz.bar.val(), "bar");
  assertEquals(baz.bar.foo.val(), "foo");
  assertEquals(baz.bar.foo.arg, "oof");

  const copy = inject(BazClass);
  assertEquals(baz, copy);

  try {
    inject(BeeClass);
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
  }
});
