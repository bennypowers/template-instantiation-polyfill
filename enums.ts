export const enum TemplateChars {
  NULL = '\u0000',
  LEFT_CURLY_BRACKET = '\u007B',
  REVERSE_SOLIDUS = '\u005C',
  RIGHT_CURLY_BRACKET = '\u007D',
}

export const enum TemplateParseState {
  initial = 'initial',
  beginCurly = 'beginCurly',
  part = 'part',
  endCurly = 'endCurly',
}

export const enum TemplateTokenType {
  string = 'string',
  part = 'part',
}
