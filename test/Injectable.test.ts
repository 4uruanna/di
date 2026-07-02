// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import { assertEquals, assertInstanceOf } from "@std/assert";
import { DependencyContainer } from "../source/DependencyContainer.ts";
import { Injectable } from "../source/decorator/injectable.ts";
import { inject } from "../source/inject.ts";

Deno.test("Inject and Retrieve", () => {
  @Injectable
  class Foo {}

  const sbl = Symbol("VERSION");
  const sblValue = "7789";
  const version = "9987";

  DependencyContainer.instance.register(sbl, sblValue);
  DependencyContainer.instance.register("version", version);
  DependencyContainer.instance.register("callback", () => 1234);

  @Injectable
  class Bar {
    public foo = inject(Foo);
    public sbl: string = inject(sbl);
    public version: string = inject("version");
    public callback: () => number = inject("callback");
  }

  const instanceFoo = inject(Foo);
  const instanceBar = inject(Bar);

  assertInstanceOf(instanceFoo, Foo);
  assertInstanceOf(instanceBar, Bar);
  assertInstanceOf(instanceBar.foo, Foo);
  assertEquals(typeof instanceBar.sbl === "string", true);
  assertEquals(typeof instanceBar.version === "string", true);
  assertEquals(instanceBar.sbl, sblValue);
  assertEquals(instanceBar.version, version);
  assertEquals(instanceBar.callback(), 1234);
});

Deno.test("Lazy injection", () => {
  @Injectable
  class Foo {}

  @Injectable
  class Bar {
    get foo() {
      return DependencyContainer.instance.resolve(Foo, "transient");
    }
  }

  const instanceBar = inject(Bar);
  assertInstanceOf(instanceBar, Bar);
  assertInstanceOf(instanceBar.foo, Foo);
});
