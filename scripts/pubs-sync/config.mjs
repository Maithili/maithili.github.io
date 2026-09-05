// @ts-check
/** Shared configuration and small shared helpers for the publication sync. */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo root — two levels up from scripts/pubs-sync/. */
export const REPO_ROOT = path.resolve(here, '..', '..');

export const PATHS = {
  scriptDir: here,
  state: path.join(here, 'seen-publications.json'),
  fixtures: path.join(here, 'fixtures'),
  backups: path.join(here, 'backups'),
  constants: path.join(REPO_ROOT, 'constants.ts'),
  latex: path.join(REPO_ROOT, 'CV', 'resume', 'publications.tex'),
  home: path.join(REPO_ROOT, 'components', 'Home.tsx'),
};

/** Google Scholar profile id (from components/Home.tsx and components/Footer.tsx). */
export const PROFILE_ID = 'dvqkwFYAAAAJ';

/** Full name as written on the website; used to decide what gets \bold{} in the CV. */
export const SELF_FULL_NAME = 'Maithili Patel';
/** Surname + first initial, used as a looser fallback when matching the self name. */
export const SELF_SURNAME = 'Patel';
export const SELF_INITIAL = 'M';

export const SCHOLAR_ORIGIN = 'https://scholar.google.com';

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** Milliseconds between Scholar requests (a random value in this range). */
export const RATE_LIMIT_MS = [3000, 6000];

/** Maximum detail-page fetches in a single run, so a bad state file can't cause a storm. */
export const MAX_DETAIL_FETCHES = 25;

export const CATEGORIES = /** @type {const} */ (['journal', 'conference', 'workshop']);

/** Maps a category to its \cvsubsection heading in publications.tex. */
export const CATEGORY_HEADING = {
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
};

/**
 * NOTE ON VENUE FORMAT — the two targets deliberately differ, do not "fix" this.
 *
 * The website stores `venue` WITHOUT a trailing year, because Home.tsx renders
 * `year` as its own field (storing it in both is the doubled-year bug we fixed).
 *
 * The CV stores the year INSIDE the venue string, because \cvpub has no year
 * argument at all — its 4th argument is the left-gutter bullet. Both are built
 * from the same clean {venue, year} pair.
 */
export const VENUE_NOTE = 'website venue omits year; CV venue appends it';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Random delay within RATE_LIMIT_MS. */
export const politeDelay = () =>
  sleep(RATE_LIMIT_MS[0] + Math.random() * (RATE_LIMIT_MS[1] - RATE_LIMIT_MS[0]));

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…',
  mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”',
};

/** Strip tags, decode entities, collapse whitespace. Used on every extracted string. */
export function decodeHtml(input) {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalized title key: lowercase, decompose accents, keep only [a-z0-9].
 * Used as the SOFT dedup key — see state.mjs for why it never suppresses silently.
 */
export function titleKey(title) {
  return String(title || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\\[a-z]+\s*/gi, ' ')   // drop LaTeX commands when seeding from .tex
    .replace(/[^a-z0-9]/g, '');
}

const SMALL_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'nor', 'but', 'for', 'of', 'on', 'in', 'to',
  'via', 'from', 'with', 'at', 'by', 'as', 'into', 'over', 'under',
]);

/**
 * Scholar returns sentence-cased titles. Title-case them, preserving tokens that
 * are already all-caps (acronyms like ADAPT:, RGB-D) and anything with internal caps.
 */
export function titleCase(title) {
  const words = String(title || '').split(/\s+/);
  return words
    .map((w, i) => {
      const bare = w.replace(/[^A-Za-z]/g, '');
      // Already an acronym or has internal capitals (e.g. "RGB-D", "iCub") — leave alone.
      if (bare.length > 1 && bare === bare.toUpperCase()) return w;
      if (/[A-Z]/.test(bare.slice(1))) return w;
      const lower = w.toLowerCase();
      const isEdge = i === 0 || i === words.length - 1;
      // A word ending a clause (after ':') is treated as an edge too.
      const afterColon = i > 0 && words[i - 1].endsWith(':');
      if (!isEdge && !afterColon && SMALL_WORDS.has(lower.replace(/[^a-z]/g, ''))) return lower;
      return lower.replace(/[a-z]/, (c) => c.toUpperCase());
    })
    .join(' ');
}

/** Strips a trailing ", 2025" / " 2025" from a venue string. Returns the clean venue. */
export function stripTrailingYear(venue, year) {
  const m = String(venue || '').match(/^(.*?)[,;]?\s*((?:19|20)\d{2})\s*$/);
  if (!m) return String(venue || '').trim();
  // Only strip when it matches the entry's own year, so mid-string years survive.
  if (year && m[2] !== String(year)) return String(venue || '').trim();
  return m[1].trim().replace(/[,;]\s*$/, '');
}
