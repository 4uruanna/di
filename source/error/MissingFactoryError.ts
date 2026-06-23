import type { Factory } from "../types.ts";

/**
 * Error thrown when attempting to resolve a dependency that has no registered factory.
 */
export class MissingFactoryError extends Error {
  /**
   * Creates a new MissingFactoryError.
   *
   * @param {Factory<unknown>} factory - The constructor function that was not found.
   */
  public constructor(factory: Factory<unknown>) {
    super(
      `Factory '${factory.name}' is not injectable: missing @Injectable() decorator.`,
    );
  }
}
