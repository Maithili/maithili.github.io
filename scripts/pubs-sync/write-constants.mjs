// @ts-check
/**
 * Reading and writing the PUBLICATIONS / UPDATES arrays in constants.ts.
 *
 * Strategy: use the TypeScript compiler API purely as a READER, to get byte-exact
 * node offsets, then splice hand-formatted text into the original source. The
 * compiler's printer would reformat the entire file — including the format-sensitive
 * bibtex template literals in PROJECTS above — producing an unreviewable diff.
 * Splicing keeps every byte outside the insertion identical.
 */

import ts from 'typescript';
import { escapeTsString } from './authors.mjs';

/**
 * @typedef {object} PubRecord
 * @property {string} id
 * @property {string} title
 * @property {string} authors
 * @property {string} venue
 * @property {string} year
 * @property {string} [type]
 * @property {string} [pdf]
 * @property {string} [vid]
 * @property {number} start   byte offset of the element
 * @property {number} end
 * @property {number} lineStart  offset of the start of the element's first line
 * @property {Record<string, {start:number,end:number}>} propRanges  offsets of each property's VALUE
 */

function sourceFileOf(source) {
  return ts.createSourceFile('constants.ts', source, ts.ScriptTarget.ESNext, true);
}

/** Unwraps `as const` / `satisfies` / parens to reach the array literal. */
function unwrap(node) {
  let n = node;
  while (
    n &&
    (ts.isAsExpression(n) || ts.isSatisfiesExpression?.(n) || ts.isParenthesizedExpression(n))
  ) {
    n = n.expression;
  }
  return n;
}

/**
 * Finds a top-level `export const <name> = [...]` array literal.
 * @returns {{ array: ts.ArrayLiteralExpression, sf: ts.SourceFile }}
 */
function findArray(source, name) {
  const sf = sourceFileOf(source);
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== name) continue;
      const init = unwrap(decl.initializer);
      if (init && ts.isArrayLiteralExpression(init)) return { array: init, sf };
    }
  }
  throw new Error(`Could not find "export const ${name}" as an array literal in constants.ts`);
}

/** Offset of the beginning of the line containing `pos`. */
function lineStartOf(source, pos) {
  const nl = source.lastIndexOf('\n', pos - 1);
  return nl === -1 ? 0 : nl + 1;
}

/**
 * Reads every PUBLICATIONS entry with its source offsets.
 * @returns {PubRecord[]}
 */
export function readPublications(source) {
  const { array, sf } = findArray(source, 'PUBLICATIONS');
  /** @type {PubRecord[]} */
  const out = [];

  for (const el of array.elements) {
    if (!ts.isObjectLiteralExpression(el)) continue;
    /** @type {any} */
    const rec = { propRanges: {} };
    for (const prop of el.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
        ? prop.name.text
        : null;
      if (!key) continue;
      const val = prop.initializer;
      if (ts.isStringLiteral(val) || ts.isNoSubstitutionTemplateLiteral(val)) {
        rec[key] = val.text;
        rec.propRanges[key] = { start: val.getStart(sf), end: val.getEnd() };
      }
    }
    rec.start = el.getStart(sf);
    rec.end = el.getEnd();
    rec.lineStart = lineStartOf(source, rec.start);
    out.push(rec);
  }
  return out;
}

/** Offset just before the array's closing `]`, at the start of that line. */
export function publicationsCloseOffset(source) {
  const { array } = findArray(source, 'PUBLICATIONS');
  return lineStartOf(source, array.getEnd() - 1);
}

/**
 * Renders one PUBLICATIONS object literal in the file's existing house style:
 * 2-space object indent, 4-space properties, single quotes, trailing commas,
 * optional keys omitted entirely when empty.
 */
export function renderPublication(entry) {
  const q = (v) => `'${escapeTsString(v)}'`;
  const lines = [
    '  {',
    `    id: ${q(entry.id)},`,
    `    title: ${q(entry.title)},`,
    `    authors: ${q(entry.authors)},`,
    `    venue: ${q(entry.venue)},`,
    `    year: ${q(entry.year)},`,
  ];
  if (entry.type) lines.push(`    type: ${q(entry.type)},`);
  if (entry.pdf) lines.push(`    pdf: ${q(entry.pdf)},`);
  if (entry.vid) lines.push(`    vid: ${q(entry.vid)},`);
  lines.push('  },');
  return lines.join('\n') + '\n';
}

/**
 * Chooses the insertion index for a new entry: the top of its year group,
 * keeping the array newest-first. Returns an index into readPublications().
 */
export function defaultInsertIndex(records, year) {
  const y = Number(year);
  for (let i = 0; i < records.length; i += 1) {
    if (Number(records[i].year) <= y) return i;
  }
  return records.length;
}

/**
 * Inserts a rendered entry at `index` (an index into readPublications()).
 * @returns {string} the new file source
 */
export function insertPublication(source, rendered, index) {
  const records = readPublications(source);
  const at = index >= records.length
    ? publicationsCloseOffset(source)
    : records[index].lineStart;
  return source.slice(0, at) + rendered + source.slice(at);
}

/** Existing ids, for collision avoidance. */
export function existingIds(source) {
  return new Set(readPublications(source).map((r) => r.id));
}

// ---------------------------------------------------------------------------
// UPDATES
// ---------------------------------------------------------------------------

/**
 * Renders one UPDATES entry. These are single-line object literals in the file,
 * with `title` always empty and `description` carrying raw HTML.
 */
export function renderUpdate({ date, description }) {
  const q = (v) => `'${escapeTsString(v)}'`;
  return `  { date: ${q(date)}, title: '', description: ${q(description)} },\n`;
}

/** Inserts an UPDATES entry at the top of the array (it is newest-first). */
export function insertUpdate(source, rendered) {
  const { array, sf } = findArray(source, 'UPDATES');
  const first = array.elements[0];
  const at = first
    ? lineStartOf(source, first.getStart(sf))
    : lineStartOf(source, array.getEnd() - 1);
  return source.slice(0, at) + rendered + source.slice(at);
}

/**
 * Validates that a candidate source still parses and has the expected shape.
 * @param {string} source
 * @param {number} expectedPubCount
 */
export function validateConstants(source, expectedPubCount) {
  const sf = sourceFileOf(source);
  // @ts-ignore parseDiagnostics is internal but stable and is what we want here.
  const diags = sf.parseDiagnostics ?? [];
  if (diags.length > 0) {
    const first = diags[0];
    const msg = ts.flattenDiagnosticMessageText(first.messageText, ' ');
    throw new Error(`constants.ts failed to parse after edit: ${msg}`);
  }
  const records = readPublications(source);
  if (records.length !== expectedPubCount) {
    throw new Error(
      `constants.ts has ${records.length} publications after edit, expected ${expectedPubCount}`
    );
  }
  const ids = records.map((r) => r.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) throw new Error(`Duplicate publication ids after edit: ${dupes.join(', ')}`);
}
