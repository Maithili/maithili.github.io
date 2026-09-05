// @ts-check
/**
 * Reading and writing CV/resume/publications.tex.
 *
 * \cvpub takes FOUR arguments: {title}{authors}{venue}{bullet}. The inline
 * comments in the existing file ("% Award", "% Location", "% Date(s)") are
 * copy-paste leftovers that misdescribe them, so new entries omit them.
 */

import { escapeLatex, escapeLatexUrl } from './authors.mjs';
import { CATEGORY_HEADING } from './config.mjs';

/**
 * Reads one brace-delimited group starting at `open` (which must be a '{').
 * Tracks nesting so \bold{...} and \href{...}{...} are handled, and skips
 * backslash-escaped braces.
 * @returns {{ body: string, end: number }} end is the offset just past the '}'
 */
function readGroup(src, open) {
  if (src[open] !== '{') throw new Error(`Expected '{' at offset ${open}`);
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    const c = src[i];
    if (c === '\\') { i += 1; continue; }
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) return { body: src.slice(open + 1, i), end: i + 1 };
    }
  }
  throw new Error(`Unbalanced braces starting at offset ${open}`);
}

/** Skips whitespace and full-line/inline comments to the next meaningful char. */
function skipGaps(src, i) {
  let p = i;
  for (;;) {
    while (p < src.length && /\s/.test(src[p])) p += 1;
    if (src[p] === '%') {
      const nl = src.indexOf('\n', p);
      if (nl === -1) return src.length;
      p = nl + 1;
      continue;
    }
    return p;
  }
}

/**
 * @typedef {object} Block
 * @property {string} category
 * @property {number} innerStart  offset just after \begin{cvpubs}
 * @property {number} innerEnd    offset of \end{cvpubs}
 */

/**
 * Locates the cvpubs environment belonging to a \cvsubsection heading.
 * @returns {Block}
 */
export function findBlock(source, category) {
  const heading = CATEGORY_HEADING[category];
  if (!heading) throw new Error(`Unknown category: ${category}`);

  const headRe = new RegExp(`\\\\cvsubsection\\s*\\{\\s*${heading}\\s*\\}`, 'i');
  const headM = source.match(headRe);
  if (!headM || headM.index === undefined) {
    throw new Error(`Could not find \\cvsubsection{${heading}} in publications.tex`);
  }

  const beginIdx = source.indexOf('\\begin{cvpubs}', headM.index);
  if (beginIdx === -1) throw new Error(`No \\begin{cvpubs} after \\cvsubsection{${heading}}`);
  const endIdx = source.indexOf('\\end{cvpubs}', beginIdx);
  if (endIdx === -1) throw new Error(`No \\end{cvpubs} after \\cvsubsection{${heading}}`);

  return {
    category,
    innerStart: beginIdx + '\\begin{cvpubs}'.length,
    innerEnd: endIdx,
  };
}

/**
 * @typedef {object} TexEntry
 * @property {string} title
 * @property {string} authors
 * @property {string} venue
 * @property {string} year
 * @property {number} start      offset of the '\' of \cvpub
 * @property {number} lineStart  offset of the start of that line
 */

/**
 * Parses the \cvpub entries inside a block.
 * @returns {TexEntry[]}
 */
export function parseEntries(source, block) {
  /** @type {TexEntry[]} */
  const out = [];
  const region = source.slice(block.innerStart, block.innerEnd);
  const re = /\\cvpub\b/g;
  let m;
  while ((m = re.exec(region)) !== null) {
    const start = block.innerStart + m.index;
    let cursor = start + m[0].length;
    /** @type {string[]} */
    const args = [];
    try {
      for (let a = 0; a < 4; a += 1) {
        cursor = skipGaps(source, cursor);
        const g = readGroup(source, cursor);
        args.push(g.body.trim());
        cursor = g.end;
      }
    } catch {
      continue; // malformed entry — skip rather than crash
    }
    const yearM = args[2].match(/((?:19|20)\d{2})/);
    const nl = source.lastIndexOf('\n', start - 1);
    out.push({
      title: args[0],
      authors: args[1],
      venue: args[2],
      year: yearM ? yearM[1] : '',
      start,
      lineStart: nl === -1 ? 0 : nl + 1,
    });
  }
  return out;
}

/**
 * Renders a new \cvpub entry in the canonical form: 2-space \cvpub, 4-space
 * arguments, no misleading comments, one trailing blank line.
 */
export function renderEntry({ title, cvAuthors, venue, year, link }) {
  const safeTitle = escapeLatex(title);
  const titleArg = link
    ? `\\href{${escapeLatexUrl(link)}}{${safeTitle}}`
    : safeTitle;
  // The CV has no year column (arg 4 is the bullet), so the year lives in the venue.
  const venueArg = year ? `${escapeLatex(venue)}, ${year}` : escapeLatex(venue);
  return [
    '  \\cvpub',
    `    {${titleArg}}`,
    `    {${cvAuthors}}`,
    `    {${venueArg}}`,
    '    {\\bullet}',
    '',
    '',
  ].join('\n');
}

/**
 * Decides where a new entry goes within a block.
 * Returns { index, sorted } — when the block is not already newest-first we
 * insert at the top and report it, rather than silently reordering the file.
 */
export function planInsert(entries, year) {
  const years = entries.map((e) => Number(e.year) || 0);
  const sorted = years.every((y, i) => i === 0 || years[i - 1] >= y);
  if (!sorted) return { index: 0, sorted: false };
  const y = Number(year);
  for (let i = 0; i < entries.length; i += 1) {
    if ((Number(entries[i].year) || 0) <= y) return { index: i, sorted: true };
  }
  return { index: entries.length, sorted: true };
}

/**
 * Inserts a rendered entry into the given category's block.
 * @returns {{ source: string, sorted: boolean, existingYears: string[] }}
 */
export function insertEntry(source, category, rendered, year) {
  const block = findBlock(source, category);
  const entries = parseEntries(source, block);
  const { index, sorted } = planInsert(entries, year);

  let at;
  if (entries.length === 0) {
    // Empty block: drop it just after \begin{cvpubs}, on its own line.
    at = block.innerStart;
    return {
      source: source.slice(0, at) + '\n\n' + rendered + source.slice(at),
      sorted: true,
      existingYears: [],
    };
  }
  at = index >= entries.length
    ? entries[entries.length - 1].lineStart
    : entries[index].lineStart;

  // When appending after the last entry, step past it instead of before it.
  if (index >= entries.length) {
    const last = entries[entries.length - 1];
    let cursor = last.start + '\\cvpub'.length;
    for (let a = 0; a < 4; a += 1) {
      cursor = skipGaps(source, cursor);
      cursor = readGroup(source, cursor).end;
    }
    const nl = source.indexOf('\n', cursor);
    at = nl === -1 ? cursor : nl + 1;
  }

  return {
    source: source.slice(0, at) + rendered + source.slice(at),
    sorted,
    existingYears: entries.map((e) => e.year),
  };
}

/**
 * Structural validation of the whole file after an edit.
 * @param {string} source
 * @param {number} expectedCount total \cvpub entries expected
 */
export function validateLatex(source, expectedCount) {
  const begins = (source.match(/\\begin\{cvpubs\}/g) || []).length;
  const ends = (source.match(/\\end\{cvpubs\}/g) || []).length;
  if (begins !== ends) {
    throw new Error(`publications.tex has ${begins} \\begin{cvpubs} but ${ends} \\end{cvpubs}`);
  }

  // Every \cvpub must be followed by exactly 4 brace-balanced groups.
  const re = /\\cvpub\b/g;
  let m;
  let count = 0;
  while ((m = re.exec(source)) !== null) {
    let cursor = m.index + m[0].length;
    for (let a = 0; a < 4; a += 1) {
      cursor = skipGaps(source, cursor);
      if (source[cursor] !== '{') {
        throw new Error(
          `\\cvpub at offset ${m.index} has fewer than 4 arguments (failed at argument ${a + 1})`
        );
      }
      cursor = readGroup(source, cursor).end;
    }
    count += 1;
  }
  if (count !== expectedCount) {
    throw new Error(`publications.tex has ${count} \\cvpub entries after edit, expected ${expectedCount}`);
  }

  // Whole-file brace balance, ignoring escaped braces and comments.
  let depth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const c = source[i];
    if (c === '\\') { i += 1; continue; }
    if (c === '%') { const nl = source.indexOf('\n', i); if (nl === -1) break; i = nl; continue; }
    if (c === '{') depth += 1;
    else if (c === '}') depth -= 1;
    if (depth < 0) throw new Error(`Unbalanced '}' at offset ${i} in publications.tex`);
  }
  if (depth !== 0) throw new Error(`publications.tex ends with ${depth} unclosed '{'`);
}

/** Counts \cvpub entries in a source. */
export function countEntries(source) {
  return (source.match(/\\cvpub\b/g) || []).length;
}

/**
 * Reduces a LaTeX fragment to plain text, for seeding and for display.
 * Unwraps \href{url}{text} to text and \bold{x}/\emph{x} to x, then unescapes.
 */
export function plainText(tex) {
  let s = String(tex ?? '');
  // \href{url}{text} -> text  (repeat for nesting)
  for (let i = 0; i < 5; i += 1) {
    const next = s.replace(/\\href\s*\{[^{}]*\}\s*\{([^{}]*)\}/g, '$1');
    if (next === s) break;
    s = next;
  }
  for (let i = 0; i < 5; i += 1) {
    const next = s.replace(/\\(?:bold|emph|textbf|textit|textsb)\s*\{([^{}]*)\}/g, '$1');
    if (next === s) break;
    s = next;
  }
  return s
    .replace(/\\textbackslash\{\}/g, '\\')
    .replace(/\\textasciitilde\{\}/g, '~')
    .replace(/\\textasciicircum\{\}/g, '^')
    .replace(/\\([&%$#_{}])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Reads every \cvpub in the file, tagged with its category. */
export function readAllEntries(source) {
  /** @type {Array<{category:string,title:string,authors:string,venue:string,year:string}>} */
  const out = [];
  for (const category of Object.keys(CATEGORY_HEADING)) {
    let block;
    try { block = findBlock(source, category); } catch { continue; }
    for (const e of parseEntries(source, block)) {
      out.push({
        category,
        title: plainText(e.title),
        authors: plainText(e.authors),
        venue: plainText(e.venue),
        year: e.year,
      });
    }
  }
  return out;
}
