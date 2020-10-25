/**
 * ### 4.4. `TemplatePart` Interface
 *
 * The abstract superclass `TemplatePart` defines two IDL attributes: `expression`, `value`, and the stringifier.
 **/
export abstract class TemplatePart {
  #expression: string;

  /**
   * The `expression` readonly attribute must, on getting, return the string inside the mustache syntax with [leading and trailing ASCII whitespace stripped](https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace).
   */
  get expression(): string {
    return this.#expression;
  }

  /**
   * The definition of `value` IDL attribute depends on the concrete subclass of `TemplatePart.`
   */
  abstract value: string;

  /**
   * The stringifier of `TemplatePart` is an alias to the `value` attribute's getter.
   */
  toString(): string {
    return this.value;
  }

  constructor(expression: string) {
    this.#expression = expression;
  }
}
