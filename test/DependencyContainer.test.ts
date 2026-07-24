// Copyright 2026 Villalonga Software. All rights reserved. Apache-2.0 license.

import {
  assertInstanceOf,
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { DependencyContainer } from "../source/DependencyContainer.ts";

Deno.test("Singleton", () => {
  class Foo {}
  class Bar {}

  const container = new DependencyContainer();
  container.registerClass(Foo);

  const instance = container.resolve(Foo);
  const clone = container.resolve(Foo);

  assertStrictEquals(instance, clone);
  assertThrows(() => container.resolve(Bar));
});

Deno.test("Scoped", () => {
  class Foo {}
  class Bar {}

  const container = new DependencyContainer();
  container.registerClass(Foo);

  const aInstance = container.resolve(Foo, "scoped", "a");
  const aClone = container.resolve(Foo, "scoped", "a");
  const bInstance = container.resolve(Foo, "scoped", "b");

  assertInstanceOf(aInstance, Foo);
  assertInstanceOf(bInstance, Foo);

  assertStrictEquals(aInstance, aClone);
  assertNotStrictEquals(aInstance, bInstance);
  assertThrows(() => container.resolve(Bar, "scoped"));

  container.disposeScope("a");
  const aInstance2 = container.resolve(Foo, "scoped", "a");

  assertNotStrictEquals(aInstance, aInstance2);
});

Deno.test("Transient", () => {
  class Foo {}
  class Bar {}

  const container = new DependencyContainer();
  container.registerClass(Foo);

  const aInstance = container.resolve(Foo, "transient");
  const bInstance = container.resolve(Foo, "transient");
  assertNotStrictEquals(aInstance, bInstance);
  assertThrows(() => container.resolve(Bar, "transient"));
});

Deno.test("Dispose", () => {
  class Foo {}

  const container = new DependencyContainer();
  container.registerClass(Foo);

  container.dispose();
  assertThrows(() => container.resolve(Foo));
});
