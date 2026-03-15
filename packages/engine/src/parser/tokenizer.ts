import type { Token } from '../types';

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const src = input.trim();

  while (i < src.length) {
    // Skip whitespace
    if (src[i] === ' ' || src[i] === '\t') {
      i++;
      continue;
    }

    // Two-char operators
    if (src[i] === '>' && src[i + 1] === '>') {
      tokens.push({ type: 'redirect_append' });
      i += 2;
      continue;
    }
    if (src[i] === '&' && src[i + 1] === '&') {
      tokens.push({ type: 'and' });
      i += 2;
      continue;
    }
    if (src[i] === '|' && src[i + 1] === '|') {
      tokens.push({ type: 'or' });
      i += 2;
      continue;
    }

    // Single-char operators
    if (src[i] === '|') {
      tokens.push({ type: 'pipe' });
      i++;
      continue;
    }
    if (src[i] === '>') {
      tokens.push({ type: 'redirect_out' });
      i++;
      continue;
    }
    if (src[i] === '<') {
      tokens.push({ type: 'redirect_in' });
      i++;
      continue;
    }
    if (src[i] === ';') {
      tokens.push({ type: 'semicolon' });
      i++;
      continue;
    }

    // Quoted strings
    if (src[i] === '"' || src[i] === "'") {
      const quote = src[i];
      i++;
      let value = '';
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\' && quote === '"' && i + 1 < src.length) {
          i++;
          value += src[i];
        } else {
          value += src[i];
        }
        i++;
      }
      i++; // skip closing quote
      tokens.push({ type: 'word', value });
      continue;
    }

    // Unquoted word
    let value = '';
    while (i < src.length && !' \t|><;&'.includes(src[i])) {
      if (src[i] === '\\' && i + 1 < src.length) {
        i++;
        value += src[i];
      } else {
        value += src[i];
      }
      i++;
    }
    if (value) tokens.push({ type: 'word', value });
  }

  return tokens;
}
