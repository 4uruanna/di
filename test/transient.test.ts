// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { inject, Injectable } from "../source/mod.ts";
import { expect } from "@std/expect";

@Injectable("first", "second")
class FooClass {
  public constructor(
    public first: string,
    public second: string,
    public third: string,
  ) {}
}

Deno.test("inject scope", () => {
  const instanceA = inject(FooClass, { type:"transient", args: ["thirdA"] });
  const instanceB = inject(FooClass, { type:"transient", args: ["thirdB"] });

  expect(instanceA === instanceB).toBe(false);
  expect(instanceA.first).toBe("first");
  expect(instanceA.second).toBe("second");
  expect(instanceA.third).toBe("thirdA");
  expect(instanceB.third).toBe("thirdB");
});
