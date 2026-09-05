// @ts-check
/**
 * Author-name handling and LaTeX escaping.
 *
 * The website's full-name string is authoritative; the CV's abbreviated form is
 * derived from it. That direction works ("Sonia Chernova" -> "S. Chernova");
 * the reverse does not, which is why the full names come from Scholar's detail
 * page rather than its listing page.
 */

import { SELF_FULL_NAME, SELF_SURNAME, SELF_INITIAL } from './config.mjs';

/** Lowercase surname particles that belong to the surname, not the given names. */
const PARTICLES = new Set([
  'van', 'von', 'der', 'den', 'de', 'del', 'della', 'da', 'di', 'du', 'dos',
  'la', 'le', 'ter', 'ten', 'bin', 'ibn', 'al', 'mac', 'mc', "o'", 'st',
]);

/** Equal-contribution and footnote markers, preserved verbatim rather than translated. */
const MARKER_RE = /^(.*?)([*†‡^#\d]+)$/;

/**
 * Escapes LaTeX special characters in ordinary text.
 * Accented characters are deliberately NOT escaped: cv.tex builds with XeLaTeX
 * (`%!TEX TS-program = xelatex`) via fontspec, so UTF-8 passes through natively.
 */
export function escapeLatex(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Escapes a URL for use as \href's first argument, which TeX reads as normal text.
 * Only the characters that actually break there are escaped; `?`, `=`, `/`, `-`
 * and `.` are left alone so the URL stays readable in the source.
 */
export function escapeLatexUrl(url) {
  return String(url ?? '').replace(/([%#&_{}$])/g, '\\$1');
}

/**
 * Escapes a value for a single-quoted TypeScript string literal.
 */
export function escapeTsString(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ');
}

/**
 * Splits one full name into its parts, detaching any trailing marker.
 * @returns {{ given: string[], surname: string, markers: string }}
 */
export function parseName(raw) {
  const trimmed = String(raw || '').trim();
  const m = trimmed.match(MARKER_RE);
  const markers = m ? m[2] : '';
  const base = (m ? m[1] : trimmed).trim();

  const tokens = base.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { given: [], surname: '', markers };
  if (tokens.length === 1) return { given: [], surname: tokens[0], markers };

  // Absorb any run of lowercase particles immediately before the last token.
  let surnameStart = tokens.length - 1;
  while (
    surnameStart > 1 &&
    PARTICLES.has(tokens[surnameStart - 1].toLowerCase().replace(/\.$/, ''))
  ) {
    surnameStart -= 1;
  }

  return {
    given: tokens.slice(0, surnameStart),
    surname: tokens.slice(surnameStart).join(' '),
    markers,
  };
}

/** "Jean-Luc" -> "J.-L."; "Maithili" -> "M." */
function initialsFor(given) {
  return given
    .map((token) =>
      token
        .split('-')
        .filter(Boolean)
        .map((part) => `${escapeLatex(part[0].toUpperCase())}.`)
        .join('-')
    )
    .join(' ');
}

/** True when this name is Maithili's own. */
export function isSelf(raw) {
  const { given, surname } = parseName(raw);
  const full = [...given, surname].join(' ').toLowerCase();
  if (full === SELF_FULL_NAME.toLowerCase()) return true;
  // Looser fallback: right surname and right first initial.
  return (
    surname.toLowerCase() === SELF_SURNAME.toLowerCase() &&
    given.length > 0 &&
    given[0][0]?.toUpperCase() === SELF_INITIAL
  );
}

/**
 * Abbreviates one full name to the CV's form, wrapping Maithili's own name in \bold{}.
 * Markers stay attached and, for the self name, go INSIDE the braces to match the
 * existing `\bold{M. Patel**}` in publications.tex.
 */
export function toCvName(raw) {
  const { given, surname, markers } = parseName(raw);
  if (!surname) return '';

  const initials = initialsFor(given);
  const body = initials ? `${initials} ${escapeLatex(surname)}` : escapeLatex(surname);
  const withMarkers = `${body}${markers}`;

  return isSelf(raw) ? `\\bold{${withMarkers}}` : withMarkers;
}

/**
 * Full website author string -> CV author string.
 * "Fethiye Irmak Dogan, Maithili Patel" -> "F. I. Dogan, \bold{M. Patel}"
 *
 * Note this yields "F. I. Dogan" where the existing CV has "F. Dogan" — no rule
 * recovers a dropped middle initial, so the result is always shown for review
 * and can be overridden directly in the confirm loop.
 */
export function toCvAuthors(fullNames) {
  return String(fullNames || '')
    .split(/\s*,\s*/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map(toCvName)
    .join(', ');
}

/**
 * Best-effort expansion of Scholar's initials form using names seen before.
 * "M Patel, S Chernova" + memory -> "Maithili Patel, Sonia Chernova".
 * Names with no match are left exactly as Scholar gave them, so it is obvious
 * which ones still need typing.
 *
 * @param {string} scholarAuthors comma-separated, e.g. "M Patel, X Puig"
 * @param {Map<string,string>} memory key `${initial}|${surnameLower}` -> full name
 */
export function expandAuthors(scholarAuthors, memory) {
  return String(scholarAuthors || '')
    .split(/\s*,\s*/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name) => {
      if (isSelf(name)) return SELF_FULL_NAME;
      const { given, surname, markers } = parseName(name);
      if (!surname || given.length === 0) return name;
      const key = `${given[0][0].toUpperCase()}|${surname.toLowerCase()}`;
      const hit = memory.get(key);
      return hit ? `${hit}${markers}` : name;
    })
    .join(', ');
}

/**
 * Builds the expansion memory from previously accepted full-name strings.
 * @param {string[]} fullNameStrings
 */
export function buildAuthorMemory(fullNameStrings) {
  /** @type {Map<string,string>} */
  const memory = new Map();
  for (const line of fullNameStrings) {
    for (const raw of String(line || '').split(/\s*,\s*/)) {
      const name = raw.trim();
      if (!name) continue;
      const { given, surname } = parseName(name);
      if (!surname || given.length === 0) continue;
      const key = `${given[0][0].toUpperCase()}|${surname.toLowerCase()}`;
      // Prefer the longest spelling seen (most complete given names).
      const base = [...given, surname].join(' ');
      const prev = memory.get(key);
      if (!prev || base.length > prev.length) memory.set(key, base);
    }
  }
  return memory;
}
