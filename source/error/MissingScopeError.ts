/**
 * Error thrown when attempting scope-based injection without providing a scope name.
 */
export class MissingScopeError extends Error {
  /**
   * Creates a new MissingScopeError.
   */
  public constructor() {
    super(
      `Cannot inject with type 'scope': a scope name is required. Provide a 'scope' string in the injection options.`,
    );
  }
}
