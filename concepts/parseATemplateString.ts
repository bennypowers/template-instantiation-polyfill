import { TemplateTokenType, TemplateParseState, TemplateChars } from '../enums';

type TemplatePair = [TemplateTokenType, string];

class Parser {
  string: string;

  /* ***********  STEP 1  ************ */
  position = 0;

  /* ***********  STEP 2  ************ */
  state = TemplateParseState.initial;

  /* ***********  STEP 3  ************ */
  beginningPosition = 0;

  /* ***********  STEP 4  ************ */
  lastCodePoint: number = TemplateChars.NULL.codePointAt(0);

  candidateEndingPosition: number;

  get codePoint(): number {
    return this.string.codePointAt(this.position);
  }

  /* ***********  STEP 5  ************ */
  tokens: TemplatePair[] = [];

  constructor(string: string) {
    this.string = string;
  }

  get isStartingExpression(): boolean {
    return (
      this.state === TemplateParseState.initial &&
      this.codePoint === TemplateChars.LEFT_CURLY_BRACKET.codePointAt(0) &&
      this.lastCodePoint !== TemplateChars.REVERSE_SOLIDUS.codePointAt(0)
    );
  }

  get hasBegunCurly(): boolean {
    return this.state === TemplateParseState.beginCurly;
  }

  get willEndExpression(): boolean {
    return (
      this.state === TemplateParseState.part &&
      this.codePoint === TemplateChars.RIGHT_CURLY_BRACKET.codePointAt(0) &&
      this.lastCodePoint !== TemplateChars.REVERSE_SOLIDUS.codePointAt(0)
    );
  }

  get isMaybeEndingExpression(): boolean {
    return (
      this.state === TemplateParseState.endCurly &&
      this.codePoint === TemplateChars.RIGHT_CURLY_BRACKET.codePointAt(0)
    );
  }

  get isDefinitelyEndingExpression(): boolean {
    return (
      this.codePoint === TemplateChars.RIGHT_CURLY_BRACKET.codePointAt(0) &&
      this.lastCodePoint !== TemplateChars.REVERSE_SOLIDUS.codePointAt(0)
    );
  }

  get isOnOpenExpression(): boolean {
    return (
      this.codePoint === TemplateChars.LEFT_CURLY_BRACKET.codePointAt(0) &&
      this.lastCodePoint !== TemplateChars.REVERSE_SOLIDUS.codePointAt(0)
    );
  }

  getExpression(): string {
    return this.string
      .substring(
        this.beginningPosition,
        this.candidateEndingPosition
      );
  }

  pushString(): void {
    this.state = TemplateParseState.part; // 6.ii.a.a
    this.tokens.push([TemplateTokenType.string, this.getExpression()]); // 6.ii.a.b
    this.beginningPosition = this.position + 1; // 6.ii.a.b
  }

  pushPart(): void {
    this.state = TemplateParseState.initial; // 6.iv.a.a
    this.tokens.push([TemplateTokenType.part, this.getExpression().trim()]); // 6.iv.a.d
  }

  parse(): TemplatePair[] {
    while (this.position < this.string.length) {
      if (this.isStartingExpression) {
        this.state = TemplateParseState.beginCurly; // 6.i.a
        this.candidateEndingPosition = this.position; // 6.i.b
      } else if (this.hasBegunCurly) {
        if (this.isOnOpenExpression) // 6.ii.a
          this.pushString();
        else // 6.ii.b
          this.state = TemplateParseState.initial; // 6.ii.b.a
      } else if (this.willEndExpression) { // 6.iii
        this.state = TemplateParseState.endCurly; // 6.iii.a
        this.candidateEndingPosition = this.position; // 6.iii.b
      } else if (this.isMaybeEndingExpression) { // 6.iv
        if (this.isDefinitelyEndingExpression) { // 6.iv.a
          this.pushPart();
        } else { // 6.iv.b
          this.state = TemplateParseState.part;
        }
      }

      this.lastCodePoint =
      this.lastCodePoint !== TemplateChars.REVERSE_SOLIDUS.codePointAt(0) ?
        this.codePoint
        : TemplateChars.NULL.codePointAt(0); // 6.v

      this.position++;
    }

    return this.tokens;
  }
}

/**
 * To **parse a template string** with a DOMString *template*, run these steps:
 *
 * 1. Let *position* be a [position variable](https://infra.spec.whatwg.org/#string-position-variable) for *template*, initially pointing at the start of *template*.
 * 2. Let *state* be “initial”.
 * 3. Let *beginningPosition* be *position*.
 * 4. Let *lastCodePoint* be U+0000 NULL.
 * 5. Let *tokens* be a list of pairs consisting of a type which takes a value of “string” or “part” and a [string](https://infra.spec.whatwg.org/#string).
 * 6. While *position* is not past the end of input:
 *     1. If *state* is “initial” and the code point is U+007B LEFT CURLY BRACKET and *lastCodePoint* is not U+005C REVERSE SOLIDUS,
 *         1. Let *state* be “beginCurly”
 *         2. Let *candidateEndingPosition* be *position*.
 *         3. Go to step 6.iv.
 *     2. If *state* is “*beginCurly*”,
 *         1.  If the code point is U+007B LEFT CURLY BRACKET and *lastCodePoint* is not U+005C REVERSE SOLIDUS,
 *             1. Let *state* be “part”.
 *             2. Append the pair of the type “string” and the code points starting at *beginningPosition* and ending immediately before *candidateEndingPosition* to the end of *tokens.*
 *             3. Let *beginningPosition* be the next code point in *template.*
 *         2. Otherwise,
 *             1. Let *state* be “initial”.
 *         3. Got to step 6.iv.
 *     3. If *state* is “part” and the code point is U+007D RIGHT CURLY BRACKET and *lastCodePoint* is not U+005C REVERSE SOLIDUS,
 *         1. Let state be “endCurly”.
 *         2. Let *candidateEndingPosition* be *position*.
 *         3. Go to step 6.iv.
 *     4. If state is “endCurly” and the code point is U+007D RIGHT CURLY BRACKET,
 *         1. If the code point is U+007D RIGHT CURLY BRACKET and *lastCodePoint* is not U+005C REVERSE SOLIDUS,
 *             1. Let *state* be “initial”.
 *             2. Let *expression* be the code points starting at *beginningPosition* and ending immediately before *candidateEndingPosition*.
 *             3. [Strip leading and trailing ASCII whitespace](https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace) from expression.
 *             4. Append the pair of type “part” and *expression* to the end of *tokens.*
 *         2. Otherwise,
 *             1. Let *state* be “part”.
 *         3. Go to step 6.iv.
 *     5. Let *lastCodePoint* be the current code point if *lastCodePoint* is not U+005C REVERSE SOLIDUS. Otherwise let *lastCodePoint* be U+0000 NULL.
 *     6. Advance *position* to the next [code point](https://infra.spec.whatwg.org/#code-point) in *template*.
 * 7. Return *tokens*.
 *
 * > Note: This algorithm supports escaping `{` with `\` and `\` with `\`. We're open to using alternate syntax like `${~}` and `{~}` in place of the mustache syntax `{{~}}`, and or not supporting these escaping characters.
 */
export function parseATemplateString(value: string): [TemplateTokenType, string][] {
  const parser = new Parser(value);
  return parser.parse();
}
