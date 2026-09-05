// @ts-check
/**
 * Persistent memory of every publication the script has already shown you.
 *
 * Dedup uses a composite key with deliberately asymmetric consequences:
 *
 *   - scholarId is the EXACT key. A match is silently skipped.
 *   - titleKey is a SOFT key. A match only produces a warning; the entry is
 *     still offered.
 *
 * That asymmetry matters. Scholar re-mints its `citation_for_view` ids when it
 * merges preprint and published clusters, so keying only on the id would
 * re-offer papers. But keying on the title would be worse: publications.tex
 * already contains two DIFFERENT 2025 papers both titled "Robot Behavior
 * Personalization from Sparse User Feedback" (an RAL journal paper and an ICRA
 * workshop paper), so a title key would silently swallow one of them.
 * Re-asking is a nuisance; silently dropping a real publication is a bug you
 * would not notice for months.
 */

import fs from 'node:fs';
import { PATHS, titleKey } from './config.mjs';

export const STATE_VERSION = 1;

/**
 * @typedef {object} StateEntry
 * @property {string|null} scholarId
 * @property {string} titleKey
 * @property {string} title
 * @property {string} year
 * @property {'accepted'|'rejected'|'deferred'} status
 * @property {string|null} category
 * @property {string|null} websiteId
 * @property {boolean} inCv
 * @property {string} authorsFull
 * @property {string} decidedAt
 * @property {string} note
 */

/** @returns {{version:number, profileId:string, lastSyncedAt:string|null, entries:StateEntry[]}} */
export function emptyState(profileId) {
  return { version: STATE_VERSION, profileId, lastSyncedAt: null, entries: [] };
}

export function stateExists() {
  return fs.existsSync(PATHS.state);
}

export function loadState(profileId) {
  if (!stateExists()) return emptyState(profileId);
  const raw = JSON.parse(fs.readFileSync(PATHS.state, 'utf8'));
  if (raw.version !== STATE_VERSION) {
    throw new Error(
      `State file version ${raw.version} is not supported (expected ${STATE_VERSION}). ` +
      `Delete ${PATHS.state} and re-run with --init to rebuild it.`
    );
  }
  if (!Array.isArray(raw.entries)) throw new Error('State file is malformed: "entries" is not an array.');
  return raw;
}

export function saveState(state) {
  const next = { ...state, lastSyncedAt: new Date().toISOString() };
  fs.writeFileSync(PATHS.state, `${JSON.stringify(next, null, 2)}\n`);
  return next;
}

/**
 * @param {object} state
 * @param {string} scholarId
 * @returns {StateEntry|undefined}
 */
export function findByScholarId(state, scholarId) {
  return state.entries.find((e) => e.scholarId && e.scholarId === scholarId);
}

/**
 * @param {object} state
 * @param {string} title
 * @returns {StateEntry|undefined}
 */
export function findByTitle(state, title) {
  const key = titleKey(title);
  return state.entries.find((e) => e.titleKey === key);
}

/**
 * Classifies a Scholar listing row against the stored state.
 * @returns {{ action:'skip'|'offer', reason:string, softMatch?:StateEntry }}
 */
export function classify(state, row) {
  const exact = findByScholarId(state, row.scholarId);
  if (exact) {
    if (exact.status === 'deferred') return { action: 'offer', reason: 'deferred last run' };
    return { action: 'skip', reason: `already ${exact.status}` };
  }
  const soft = findByTitle(state, row.title);
  if (soft) {
    return {
      action: 'offer',
      reason: 'possible duplicate — same title, different Scholar id',
      softMatch: soft,
    };
  }
  return { action: 'offer', reason: 'new' };
}

/** Adds or replaces an entry, keyed on scholarId when present. */
export function upsert(state, entry) {
  const idx = entry.scholarId
    ? state.entries.findIndex((e) => e.scholarId === entry.scholarId)
    : state.entries.findIndex((e) => e.titleKey === entry.titleKey && !e.scholarId);
  if (idx >= 0) state.entries[idx] = { ...state.entries[idx], ...entry };
  else state.entries.push(entry);
  return state;
}

/**
 * @param {Partial<StateEntry> & {title:string}} fields
 * @returns {StateEntry}
 */
export function makeEntry(fields) {
  return {
    scholarId: fields.scholarId ?? null,
    titleKey: titleKey(fields.title),
    title: fields.title,
    year: fields.year ?? '',
    status: fields.status ?? 'deferred',
    category: fields.category ?? null,
    websiteId: fields.websiteId ?? null,
    inCv: fields.inCv ?? false,
    authorsFull: fields.authorsFull ?? '',
    decidedAt: new Date().toISOString(),
    note: fields.note ?? '',
  };
}

/**
 * Builds seed entries from what is already in the two source files, so the very
 * first run does not re-offer papers that were added by hand years ago.
 *
 * Reads BOTH files: "Longitudinal Proactive Robot Assistance" is in the CV but
 * not on the website, so reading only one of them would miss it.
 *
 * @param {Array<{id:string,title:string,authors:string,venue:string,year:string}>} websitePubs
 * @param {Array<{category:string,title:string,authors:string,venue:string,year:string}>} cvPubs
 * @param {Array<{scholarId:string,title:string}>} scholarRows
 */
export function buildSeed(websitePubs, cvPubs, scholarRows) {
  /** @type {Map<string, StateEntry>} */
  const byTitle = new Map();

  for (const p of websitePubs) {
    const key = titleKey(p.title);
    byTitle.set(key, makeEntry({
      title: p.title,
      year: p.year,
      status: 'accepted',
      websiteId: p.id,
      authorsFull: p.authors,
      note: 'seeded from constants.ts',
    }));
  }

  for (const c of cvPubs) {
    const key = titleKey(c.title);
    const existing = byTitle.get(key);
    if (existing) {
      // Same title in both files. If the categories differ this is the known
      // RAL-vs-ICRA-workshop collision; keep both by giving the CV one its own key.
      if (existing.inCv && existing.category && existing.category !== c.category) {
        byTitle.set(`${key}#${c.category}`, makeEntry({
          title: c.title, year: c.year, status: 'accepted',
          category: c.category, inCv: true,
          note: `seeded from publications.tex (${c.category})`,
        }));
        continue;
      }
      existing.inCv = true;
      existing.category = existing.category ?? c.category;
      continue;
    }
    byTitle.set(key, makeEntry({
      title: c.title,
      year: c.year,
      status: 'accepted',
      category: c.category,
      inCv: true,
      note: 'seeded from publications.tex',
    }));
  }

  // Back-fill Scholar ids where a title matches.
  const claimed = new Set();
  for (const row of scholarRows) {
    const key = titleKey(row.title);
    for (const [k, entry] of byTitle) {
      if (entry.scholarId || claimed.has(row.scholarId)) continue;
      if (k === key || k.startsWith(`${key}#`)) {
        entry.scholarId = row.scholarId;
        claimed.add(row.scholarId);
        break;
      }
    }
  }

  return [...byTitle.values()];
}

/** Full-name strings from accepted entries, for the author-expansion memory. */
export function authorStrings(state) {
  return state.entries.map((e) => e.authorsFull).filter(Boolean);
}
